/**
 * Fetch Shwapno Products and export as JSON
 * Run with: node scrapers/fetchShwapnoProducts.js
 */

import ShwapnoScraper from './shwapnoScraper.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchAndSaveProducts() {
  console.log('🚀 Starting Shwapno product scraper...\n');

  const scraper = new ShwapnoScraper();

  try {
    // Scrape products from homepage
    console.log('📥 Scraping homepage products...');
    const homeProducts = await scraper.scrapeProducts();

    // Scrape from different categories
    console.log('📥 Scraping category products...');
    const categories = ['tea', 'coffee', 'snacks'];
    let allProducts = [...homeProducts];

    for (const category of categories) {
      const categoryProducts = await scraper.scrapeSpecificCategory(category);
      console.log(`   - ${category}: ${categoryProducts.length} products`);
      allProducts = [...allProducts, ...categoryProducts];
    }

    // Remove duplicates by name
    const uniqueProducts = Array.from(
      new Map(allProducts.map(p => [p.name, p])).values()
    );

    // Save to JSON
    const outputPath = path.join(__dirname, '../src/data/shwapno_products.json');
    
    // Create directory if it doesn't exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(uniqueProducts, null, 2));

    console.log(`\n✅ Success! ${uniqueProducts.length} unique products saved`);
    console.log(`📁 File: src/data/shwapno_products.json`);
    console.log('\n📝 Sample products:');
    console.log(JSON.stringify(uniqueProducts.slice(0, 3), null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fetchAndSaveProducts();
