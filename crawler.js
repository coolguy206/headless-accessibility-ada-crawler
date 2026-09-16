const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const fs = require('fs');

async function runMultiPageAudit() {
    // 1. List the critical template variations to audit
    const urlsToScan = [
        'https://teacollection.com',                                 
        'https://teacollection.com/collections/all-new-arrivals',         
        'https://teacollection.com/products/flannel-button-up-shirt-cottage-hearth-plaid-26f23105'   
    ];

    console.log(`Starting comprehensive ADA scan across ${urlsToScan.length} pages...`);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Add the Source Page URL to our CSV header
    let csvContent = 'Page URL,ID,Impact,Description,Help URL,Broken Element HTML,Failure Summary\n';

    try {
        for (const targetUrl of urlsToScan) {
            console.log(`\nScanning: ${targetUrl}...`);
            
            // Navigate to the target page
            await page.goto(targetUrl, { waitUntil: 'networkidle2' });

            // Run the accessibility scan
            const results = await new AxePuppeteer(page).analyze();
            const violations = results.violations;

            console.log(`-> Found ${violations.length} rule violations on this page.`);

            // Process data for this specific page
            for (const violation of violations) {
                const id = violation.id;
                const impact = violation.impact;
                const description = violation.description.replace(/"/g, '""').replace(/\n/g, ' ');
                const helpUrl = violation.helpUrl;

                for (const node of violation.nodes) {
                    const targetHtml = node.html.replace(/"/g, '""').replace(/\n/g, ' ');
                    const summary = node.failureSummary.replace(/"/g, '""').replace(/\n/g, ' ');
                    
                    // Append row with the active targetUrl included
                    csvContent += `"${targetUrl}","${id}","${impact}","${description}","${helpUrl}","${targetHtml}","${summary}"\n`;
                }
            }
        }

        // 2. Save the aggregated CSV report
        fs.writeFileSync('site-wide-ada-report.csv', csvContent);
        console.log(`\n🎉 Full Multi-Page Audit Complete!`);
        console.log(`Spreadsheet saved to: ./site-wide-ada-report.csv`);

    } catch (error) {
        console.error('An error occurred during the multi-page audit:', error);
    } finally {
        await browser.close();
    }
}

runMultiPageAudit();
