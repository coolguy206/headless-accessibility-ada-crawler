# Universal Web Accessibility (ADA) Layout Crawler

A platform-agnostic, automated headless browser web crawler designed to programmatically audit web applications and e-commerce templates for WCAG 2.1 AA and ADA compliance violations.

## 🚀 Business Impact & Value
Web accessibility is legally and commercially critical, directly influencing digital risk mitigation, SEO discoverability, and universal user experience. This decoupled, script-driven utility allows teams to crawl arbitrary web environments—such as production storefronts, landing pages, or user dashboards—to immediately uncover structural layout failures, broken input labels, and missing keyboard focus states before they present a compliance risk.

## 🛠️ Technical Stack
- **Runtime Environment:** Node.js
- **Browser Automation:** Puppeteer (Headless Chrome)
- **Compliance Engine:** `@axe-core/puppeteer`
- **Data Streaming:** Node.js Native File System (`fs` & `path`)

## ⚙️ Core Architecture
- **Decoupled Configuration Input:** Employs a text-driven ingestion system (`urls.txt`), segregating technical engine execution from application target parameters to achieve maximum script modularity.
- **Dynamic Render Stabilization:** Enforces network stabilization handlers (`networkidle2`) within the headless Chrome thread to cleanly evaluate heavy JavaScript-driven layers, dynamic single-page applications (SPAs), and injected third-party vendor app frames.
- **Asynchronous Execution & Safe Failures:** Processes target sweeps sequentially inside isolated browser sessions with robust catch blocks; if a target domain times out, the error logs cleanly inside the dashboard without crashing the global sweep.
- **Structured Executive Reporting:** flattens deeply nested structural compliance objects into clear relational data blocks, automatically exporting a `universal-ada-report.csv` spreadsheet detailing exact failure element strings, compliance severity mapping, and step-by-step repair guides.

## 💻 Installation & Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/coolguy206/shopify-ada-crawler.git
   cd universal-web-ada-crawler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Populate your targeting list. Update file named `urls.txt` in the root folder and drop your links (one per line):
   ```text
   https://example.com
   https://example.com
   https://example.com
   ```

4. Execute the automation pipeline:
   ```bash
   npm start
   ```
