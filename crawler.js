const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const fs = require('fs');
const path = require('path');

async function runUniversalAudit() {
    const txtPath = path.join(__dirname, 'urls.txt');

    // 1. Ensure the urls.txt configuration file exists
    if (!fs.existsSync(txtPath)) {
        console.error("❌ Error: 'urls.txt' file not found. Please create it and add target URLs.");
        return;
    }

    // 2. Read file and parse out URLs, filtering out empty lines or spaces
    const urlsToScan = fs.readFileSync(txtPath, 'utf-8')
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0 && url.startsWith('http'));

    if (urlsToScan.length === 0) {
        console.warn("⚠️ Warning: 'urls.txt' is empty. Add at least one URL starting with http:// or https://");
        return;
    }

    console.log(`Starting comprehensive ADA scan across ${urlsToScan.length} unique targets...`);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    let csvContent = 'Scanned URL,ID,Impact,Description,Help URL,Broken Element HTML,Failure Summary\n';

    try {
        for (const targetUrl of urlsToScan) {
            console.log(`\nScanning: ${targetUrl}...`);

            try {
                await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
                const results = await new AxePuppeteer(page).analyze();
                const violations = results.violations;

                console.log(`-> Found ${violations.length} rule violations.`);

                for (const violation of violations) {
                    const id = violation.id;
                    const impact = violation.impact || 'unknown';
                    const description = violation.description.replace(/"/g, '""').replace(/\n/g, ' ');
                    const helpUrl = violation.helpUrl;

                    for (const node of violation.nodes) {
                        const targetHtml = node.html.replace(/"/g, '""').replace(/\n/g, ' ');
                        const summary = node.failureSummary.replace(/"/g, '""').replace(/\n/g, ' ');

                        csvContent += `"${targetUrl}","${id}","${impact}","${description}","${helpUrl}","${targetHtml}","${summary}"\n`;
                    }
                }
            } catch (pageError) {
                console.error(`❌ Failed to scan ${targetUrl}:`, pageError.message);
                // Append the failure log directly to the spreadsheet so the user knows it failed
                csvContent += `"${targetUrl}","SCAN_FAILED","ERROR","Could not reach page","","","${pageError.message.replace(/"/g, '""')}"\n`;
            }
        }

        // Save the spreadsheet output
        fs.writeFileSync('universal-ada-report.csv', csvContent);
        console.log(`\n🎉 Scan Complete! Cumulative results saved to: ./universal-ada-report.csv`);

    } catch (error) {
        console.error('An error occurred during execution:', error);
    } finally {
        await browser.close();
    }
}

runUniversalAudit();
