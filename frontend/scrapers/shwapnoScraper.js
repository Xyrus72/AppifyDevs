/**
 * Shwapno Web Scraper
 * Scrapes product data from shwapno.com using Cheerio
 * Install: npm install cheerio axios
 */

import axios from 'axios';
import { load } from 'cheerio';

export default class ShwapnoScraper {
  constructor() {
    this.baseUrl = 'https://www.shwapno.com';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };
  }

  async scrapeProducts(categoryUrl = '') {
    try {
      const url = categoryUrl ? `${this.baseUrl}${categoryUrl}` : this.baseUrl;
      console.log(`🔍 Scraping: ${url}`);

      const response = await axios.get(url, { headers: this.headers });
      const $ = load(response.data);

      const products = [];

      // Selector for Shwapno product cards
      $('[class*="product"]').each((index, element) => {
        const $product = $(element);

        // Extract product data
        const name = $product.find('a[href*="shwapno.com"]').first().text().trim();
        const priceText = $product.find('[class*="price"]').text().trim();
        const link = $product.find('a[href*="shwapno.com"]').first().attr('href');

        if (name && priceText) {
          // Parse price (remove special characters, keep numbers)
          const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;

          products.push({
            id: products.length + 1,
            name: name,
            price: price,
            category: 'Shwapno',
            rating: 4.5,
            reviews: Math.floor(Math.random() * 500),
            image: '🛍️',
            description: name,
            url: link ? `${this.baseUrl}${link}` : ''
          });
        }
      });

      console.log(`✅ Found ${products.length} products`);
      return products;

    } catch (error) {
      console.error('❌ Scraping error:', error.message);
      return [];
    }
  }

  async scrapeSpecificCategory(category) {
    /**
     * Categories available:
     * /fruits-and-vegetables
     * /meat-and-fish
     * /tea
     * /coffee
     * /snacks
     * /dairy
     * /cooking
     */
    return this.scrapeProducts(`/${category}`);
  }
}
