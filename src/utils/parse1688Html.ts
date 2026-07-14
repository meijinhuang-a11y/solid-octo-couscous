import type { ProductInfo, ProductCategory, SupplierInfo, DropshippingRules, ProfitInfo, ProductImage } from '@/types';
import { autoClassify } from '@/store/productExtractor';

interface ParsedProduct {
  title: string;
  images: ProductImage[];
  price: string;
  originalPrice?: string;
  sales: string;
  storeName: string;
  storeUrl: string;
  location: string;
  shipping: string;
  deliveryTime: string;
  specifications: Record<string, string>;
  description: string;
  tags: string[];
  skuItems: string[];
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').replace(/[\n\r\t]/g, ' ').trim();
}

function parsePrice(text: string): number {
  const match = text.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function normalizeImageUrl(src: string): string {
  if (!src) return '';
  let url = src;
  url = url.replace(/(\.(?:jpg|jpeg|png|webp))_\d+x\d+[q\d]*\.(?:jpg|jpeg|png|webp)$/i, '$1');
  url = url.replace(/_\d+x\d+[q\d]*\.(jpg|jpeg|png|webp)$/i, '.$1');
  url = url.replace(/(\.(?:jpg|jpeg|png|webp))_\d+x\d+/i, '$1');
  url = url.replace(/(\.(?:jpg|jpeg|png|webp))\?.*$/i, '$1');
  url = url.replace(/\?.*$/, '');
  return url;
}

function extractImages(doc: Document): ProductImage[] {
  const images: ProductImage[] = [];
  const seenUrls = new Set<string>();

  const addImage = (src: string) => {
    if (!src) return;
    if (images.length >= 5) return;
    const normalized = normalizeImageUrl(src);
    if (!normalized) return;
    if (seenUrls.has(normalized)) return;
    if (!normalized.includes('alicdn') && !normalized.includes('1688.com')) return;
    if (!/\.(jpg|jpeg|png|webp|gif)/i.test(normalized)) return;
    seenUrls.add(normalized);
    images.push({ url: normalized, alt: `商品图${images.length + 1}` });
  };

  const extractFromElement = (el: Element) => {
    const imgEl = el as HTMLImageElement;
    const srcs = [
      imgEl.src,
      imgEl.getAttribute('data-src'),
      imgEl.getAttribute('data-lazy-src'),
      imgEl.getAttribute('data-original'),
      imgEl.getAttribute('data-ks-lazyload'),
      imgEl.getAttribute('data-actualsrc'),
      imgEl.getAttribute('data-big'),
      imgEl.getAttribute('data-image'),
      imgEl.getAttribute('srcset'),
    ];
    for (const src of srcs) {
      if (src && src.includes('alicdn')) {
        const urls = src.split(/[,\s]/).map(s => s.trim()).filter(s => s);
        for (const u of urls) {
          addImage(u);
        }
      }
    }
    const style = imgEl.getAttribute('style') || '';
    const bgMatch = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
    if (bgMatch) addImage(bgMatch[1]);
  };

  const prioritySelectors = [
    '[class*="main-image"] img',
    '[class*="main-img"] img',
    '.sk-main-image-list img',
    '.vertical-img img',
    '[class*="vertical-img"] img',
    '[class*="detail-gallery"] img',
    '[class*="gallery"] img',
    '[class*="sku-img"] img',
    '[class*="spec-img"] img',
    '[class*="product-img"] img',
    '[class*="goods-img"] img',
    '[class*="item-img"] img',
    '.tab-container img',
    '#dt-tab img',
    '.offer-img-box img',
    '[class*="offer-img"] img',
    '.detail-img-list img',
    '[class*="img-list"] img',
    '[class*="image-list"] img',
    '[class*="slide"] img',
    '[class*="carousel"] img',
    '[class*="slider"] img',
    '[class*="swiper"] img',
    '[data-lazy-src]',
    '[data-src]',
    '[data-original]',
  ];

  for (const sel of prioritySelectors) {
    try {
      const els = doc.querySelectorAll(sel);
      els.forEach((el) => extractFromElement(el));
      if (images.length >= 5) break;
    } catch (e) {
      // skip invalid selectors
    }
  }

  if (images.length < 5) {
    const allImgs = doc.querySelectorAll('img');
    allImgs.forEach((img) => {
      if (images.length >= 5) return;
      extractFromElement(img);
    });
  }

  if (images.length < 5) {
    const allElements = doc.querySelectorAll('[style*="background"], [style*="url("]');
    allElements.forEach((el) => {
      if (images.length >= 5) return;
      const style = (el as HTMLElement).style.cssText || '';
      const matches = style.match(/url\(['"]?([^'")\s]+)['"]?\)/g);
      if (matches) {
        matches.forEach((m) => {
          const urlMatch = m.match(/url\(['"]?([^'")\s]+)['"]?\)/);
          if (urlMatch) addImage(urlMatch[1]);
        });
      }
    });
  }

  return images.slice(0, 5);
}

function isCompanyName(text: string): boolean {
  const companyPatterns = ['有限公司', '有限责任公司', '股份公司', '集团', '工厂', '制造厂', '生产厂', '商行', '经营部', '工作室', '贸易公司', '淘宝店', '旗舰店', '企业店', '公司', '实业', '商贸', '电子科技', '科技公司', '工贸', '经贸'];
  return companyPatterns.some((p) => text.includes(p));
}

function extractTitle(doc: Document): string {
  const candidates: string[] = [];

  const addCandidate = (text: string, priority: number) => {
    const cleaned = cleanText(text);
    if (!cleaned || cleaned.length < 5) return;
    if (cleaned.length > 150) return;
    if (isCompanyName(cleaned)) {
      candidates.push({ text: cleaned, priority: priority + 100 } as any);
    } else {
      candidates.push({ text: cleaned, priority } as any);
    }
  };

  const ogTitle = doc.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    addCandidate(ogTitle.getAttribute('content') || '', 1);
  }

  const ogDescription = doc.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    const content = ogDescription.getAttribute('content') || '';
    const firstSentence = content.split(/[。，；.!?]/)[0];
    addCandidate(firstSentence, 90);
  }

  const titleSelectors = [
    '.d-title',
    '[class*="offer-title"]',
    '[class*="title-main"]',
    '.mod-detail-title .d-title',
    '.title-text',
    '[class*="subject"]',
    '[class*="item-title"]',
    '[data-title]',
    '.offer-subject',
    '.offer-title-text',
    '[class*="detail-title"]',
    '[class*="product-title"]',
    '.sku-title',
    '[class*="goods-title"]',
    '.item-name',
    '[class*="name-text"]',
    '.product-name',
    '[class*="goods-name"]',
    '[class*="title-wrap"]',
    '[class*="title-content"]',
    '[class*="main-title"]',
    '[class*="head-title"]',
    '.mod-title .d-title',
    '[class*="price"] ~ [class*="title"]',
    'h1',
    'h2',
  ];

  for (let i = 0; i < titleSelectors.length; i++) {
    const sel = titleSelectors[i];
    try {
      const els = doc.querySelectorAll(sel);
      els.forEach((el) => {
        const text = el.textContent || '';
        addCandidate(text, 10 + i * 0.5);
      });
    } catch (e) {
      // skip
    }
  }

  const metaDesc = doc.querySelector('meta[name="description"]');
  if (metaDesc) {
    const content = metaDesc.getAttribute('content') || '';
    const firstSentence = content.split(/[。，；.!?]/)[0];
    addCandidate(firstSentence, 80);
  }

  const titleEl = doc.querySelector('title');
  if (titleEl) {
    let text = titleEl.textContent || '';
    text = text.replace(/[-|_\s]+阿里巴巴.*$/gi, '');
    text = text.replace(/[-|_\s]+1688.*$/gi, '');
    text = text.replace(/[-|_\s]+淘宝.*$/gi, '');
    text = text.replace(/[-|_\s]+天猫.*$/gi, '');
    text = cleanText(text);
    if (text && text.length > 5 && text.length < 100) {
      if (isCompanyName(text)) {
        addCandidate(text, 95);
      } else {
        addCandidate(text, 50);
      }
    }
  }

  const metaKeywords = doc.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    const content = metaKeywords.getAttribute('content') || '';
    const firstPhrase = content.split(/[,，]/)[0];
    addCandidate(firstPhrase, 70);
  }

  const sortedCandidates = candidates
    .map((c: any) => c)
    .sort((a: any, b: any) => a.priority - b.priority);

  for (const c of sortedCandidates) {
    if (!isCompanyName(c.text) && c.text.length >= 5) {
      return c.text;
    }
  }

  if (sortedCandidates.length > 0) {
    return sortedCandidates[0].text;
  }

  return '';
}

function extractPrice(doc: Document): { price: string; originalPrice?: string } {
  const priceSelectors = [
    '.price .value',
    '.price .price-content',
    '.price-content .price-text',
    '[class*="price-amount"]',
    '[data-price]',
    '.mod-detail-price .price',
    '.price-text',
    '[class*="originPrice"]',
    '.sk-price .price',
    '[class*="detail-price"] [class*="price"]',
  ];

  for (const sel of priceSelectors) {
    const el = doc.querySelector(sel);
    if (el) {
      const text = cleanText(el.textContent || '');
      if (text && /¥|元|价格/.test(text) || /\d+\.\d+/.test(text)) {
        const priceMatch = text.match(/¥?\s*([\d.]+)/);
        if (priceMatch) {
          return { price: `¥${priceMatch[1]}` };
        }
      }
    }
  }

  const allText = doc.body.textContent || '';
  const priceMatch = allText.match(/价格[^\d]*¥?\s*([\d.]+)/);
  if (priceMatch) {
    return { price: `¥${priceMatch[1]}` };
  }

  return { price: '¥0.00' };
}

function extractSales(doc: Document): string {
  const salesSelectors = [
    '[class*="sales"]',
    '[class*="transaction"]',
    '.mod-detail-price .sales',
    '[class*="deal-count"]',
  ];

  for (const sel of salesSelectors) {
    const el = doc.querySelector(sel);
    if (el) {
      const text = cleanText(el.textContent || '');
      if (text && /已售|成交|销量|卖出/.test(text)) {
        return text;
      }
    }
  }

  return '0件';
}

function extractStoreInfo(doc: Document): { name: string; url: string; years: number; tags: string[]; rating: number } {
  let name = '';
  let url = '';
  let years = 0;
  let tags: string[] = [];
  let rating = 0;

  const shopLinkSelectors = [
    'a[href*="shop"][href*=".1688.com"]',
    'a[href*="store"][href*=".1688.com"]',
    '.shop-name a',
    '[class*="company-name"] a',
  ];

  for (const sel of shopLinkSelectors) {
    const el = doc.querySelector(sel);
    if (el) {
      const text = cleanText(el.textContent || '');
      if (text && text.length > 2 && text.length < 50 && !text.includes('客服') && !text.includes('入驻')) {
        name = text;
        url = (el as HTMLAnchorElement).href;
        break;
      }
    }
  }

  if (!name) {
    const bodyText = doc.body.textContent || '';
    const companyMatch = bodyText.match(/([\u4e00-\u9fa5]+(有限公司|工厂|商行|经营部|工作室|贸易))/);
    if (companyMatch) {
      name = companyMatch[1];
    }
  }

  const yearsMatch = doc.body.textContent?.match(/(\d+)\s*年/);
  if (yearsMatch) {
    years = parseInt(yearsMatch[1]);
  }

  const tagSelectors = [
    '[class*="tag"]',
    '[class*="badge"]',
    '.shop-tags span',
    '[class*="icon-text"]',
  ];

  const validTags = ['超级工厂', '源头旗舰', '实力商家', '旗舰店', '一件代发', '48小时发货', '7天包换', '诚信通'];
  for (const sel of tagSelectors) {
    const els = doc.querySelectorAll(sel);
    els.forEach((el) => {
      const text = cleanText(el.textContent || '');
      if (text && text.length > 1 && text.length < 15 && validTags.some((t) => text.includes(t))) {
        if (!tags.includes(text)) tags.push(text);
      }
    });
  }

  const ratingMatch = doc.body.textContent?.match(/(\d\.\d)\s*分/);
  if (ratingMatch) {
    rating = parseFloat(ratingMatch[1]);
  }

  return { name, url, years, tags, rating: rating || 4.5 };
}

function extractLocation(doc: Document): string {
  const locSelectors = [
    '[class*="location"]',
    '[class*="address"]',
    '[class*="freight"]',
    '.mod-detail-freight .location',
  ];

  for (const sel of locSelectors) {
    const el = doc.querySelector(sel);
    if (el) {
      const text = cleanText(el.textContent || '');
      const locMatch = text.match(/([\u4e00-\u9fa5]{2,4}[\u4e00-\u9fa5]{2,4})/);
      if (locMatch && /[省市州]/.test(locMatch[1])) {
        return locMatch[1];
      }
    }
  }

  const bodyText = doc.body.textContent || '';
  const locMatch = bodyText.match(/发货地[:：\s]*([\u4e00-\u9fa5]{2,8})/);
  if (locMatch) return locMatch[1];

  return '';
}

function extractShipping(doc: Document): string {
  const shipSelectors = [
    '[class*="freight"]',
    '[class*="shipping"]',
    '.mod-detail-freight',
    '[class*="logistics"]',
  ];

  for (const sel of shipSelectors) {
    const el = doc.querySelector(sel);
    if (el) {
      const text = cleanText(el.textContent || '');
      if (text && /运费|包邮|发货|快递/.test(text)) {
        return text.substring(0, 100);
      }
    }
  }

  return '包邮';
}

function extractDeliveryTime(doc: Document): string {
  const delivSelectors = [
    '[class*="delivery"]',
    '[class*="dispatch"]',
    '[class*="delivery-time"]',
  ];

  for (const sel of delivSelectors) {
    const el = doc.querySelector(sel);
    if (el) {
      const text = cleanText(el.textContent || '');
      if (text && /发货|小时|天内|揽收/.test(text)) {
        return text.substring(0, 100);
      }
    }
  }

  const bodyText = doc.body.textContent || '';
  const delivMatch = bodyText.match(/(\d+小时内发货|\d+天内发货|承诺\d+小时发货)/);
  if (delivMatch) return delivMatch[1];

  return '48小时内发货';
}

function extractSpecifications(doc: Document): Record<string, string> {
  const specs: Record<string, string> = {};
  const specSelectors = [
    '[class*="prop-item"]',
    '[class*="attribute-row"]',
    '.offer-attr-list li',
    '[class*="detail-attr"] tr',
  ];

  for (const sel of specSelectors) {
    const rows = doc.querySelectorAll(sel);
    rows.forEach((row) => {
      const label = row.querySelector('[class*="label"], dt, th, td:first-child');
      const val = row.querySelector('[class*="value"], dd, td:last-child');
      if (label && val) {
        const k = cleanText(label.textContent || '').replace(/[：:]$/, '');
        const v = cleanText(val.textContent || '');
        if (k && v && k.length < 20 && v.length < 100 && k !== v) {
          specs[k] = v;
        }
      }
    });
  }

  if (Object.keys(specs).length === 0) {
    const bodyText = doc.body.textContent || '';
    const patterns = [
      /材质[:：]\s*([^\n，。；]+)/g,
      /风格[:：]\s*([^\n，。；]+)/g,
      /品牌[:：]\s*([^\n，。；]+)/g,
      /货号[:：]\s*([^\n，。；]+)/g,
      /工艺[:：]\s*([^\n，。；]+)/g,
      /加工定制[:：]\s*([^\n，。；]+)/g,
    ];
    for (const pat of patterns) {
      let m;
      while ((m = pat.exec(bodyText)) !== null) {
        const key = pat.source.match(/([\u4e00-\u9fa5]+)/)?.[0] || '';
        if (key && m[1]) specs[key] = m[1].trim();
      }
    }
  }

  return specs;
}

function extractDescription(doc: Document): string {
  const descSelectors = [
    '[class*="offer-desc"]',
    '[class*="description"]',
    '.desc-content',
    '[class*="detail-desc"]',
  ];

  for (const sel of descSelectors) {
    const el = doc.querySelector(sel);
    if (el) {
      const text = cleanText(el.textContent || '');
      if (text && text.length > 20) {
        return text.substring(0, 500);
      }
    }
  }

  const metaDesc = doc.querySelector('meta[name="description"]');
  if (metaDesc) {
    const content = metaDesc.getAttribute('content');
    if (content && content.length > 20) return content.substring(0, 500);
  }

  return '';
}

function extractSkuItems(doc: Document): string[] {
  const skus: string[] = [];
  const skuSelectors = [
    '[class*="sku-item"]',
    '[class*="spec-item"]',
    '.sku-item',
    '[class*="item-sku"]',
  ];

  for (const sel of skuSelectors) {
    const els = doc.querySelectorAll(sel);
    els.forEach((el) => {
      const text = cleanText(el.getAttribute('title') || el.textContent || '');
      if (text && text.length > 1 && text.length < 30 && !text.includes('¥') && !text.includes('库存')) {
        if (!skus.includes(text)) skus.push(text);
      }
    });
  }

  if (skus.length === 0) {
    const bodyText = doc.body.textContent || '';
    const sizeMatch = bodyText.match(/尺寸[:：]\s*([^\n]+)/);
    if (sizeMatch) {
      const sizes = sizeMatch[1].split(/[,，、]/).map((s) => s.trim()).filter((s) => s && s.length < 20);
      skus.push(...sizes);
    }
  }

  return skus.slice(0, 30);
}

function extractTags(doc: Document): string[] {
  const tags: string[] = [];
  const validTagPatterns = ['一件代发', '48小时发货', '7天包换', '包邮', '闪电发货', '品质严选', '源头工厂', '实力商家'];

  const bodyText = doc.body.textContent || '';
  for (const tag of validTagPatterns) {
    if (bodyText.includes(tag)) {
      tags.push(tag);
    }
  }

  return [...new Set(tags)].slice(0, 10);
}

function extractSupplierRating(doc: Document): { rating: number; responseTime: string } {
  const bodyText = doc.body.textContent || '';
  const ratingMatch = bodyText.match(/(\d\.\d)\s*分/);
  const responseMatch = bodyText.match(/响应[^\d]*(\d+[小时分钟]+)/);

  return {
    rating: ratingMatch ? parseFloat(ratingMatch[1]) : 4.5,
    responseTime: responseMatch ? responseMatch[1] : '2小时内',
  };
}

export function parse1688Html(html: string, url: string): ProductInfo {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const title = extractTitle(doc);
  const images = extractImages(doc);
  const { price, originalPrice } = extractPrice(doc);
  const sales = extractSales(doc);
  const storeInfo = extractStoreInfo(doc);
  const location = extractLocation(doc);
  const shipping = extractShipping(doc);
  const deliveryTime = extractDeliveryTime(doc);
  const specifications = extractSpecifications(doc);
  const description = extractDescription(doc);
  const skuItems = extractSkuItems(doc);
  const tags = extractTags(doc);
  const { rating, responseTime } = extractSupplierRating(doc);

  const costPrice = parsePrice(price);
  const category = autoClassify(title, tags, description);

  const supplier: SupplierInfo = {
    name: storeInfo.name || '未知供应商',
    url: storeInfo.url || '',
    location: location || '未知',
    rating: storeInfo.rating || rating,
    yearsInBusiness: storeInfo.years || 1,
    responseTime,
    tags: storeInfo.tags.length > 0 ? storeInfo.tags : tags,
  };

  const dropshipping: DropshippingRules = {
    supportsDropshipping: tags.some((t) => t.includes('一件代发')),
    providesXhsWaybill: false,
    supportsFreeReturn: tags.some((t) => t.includes('包换') || t.includes('退货')),
    minOrderQuantity: 1,
    returnPolicy: tags.some((t) => t.includes('包换')) ? '7天无理由退换' : '质量问题包退',
  };

  const profit: ProfitInfo = {
    costPrice,
    sellingPrice: 0,
    shippingCost: 0,
    platformFee: 0,
    profitPerUnit: 0,
    profitMargin: 0,
  };

  return {
    id: Date.now().toString(),
    url,
    title,
    images: images.length > 0 ? images : [{ url: '', alt: '商品主图' }],
    price,
    originalPrice,
    sales,
    storeName: supplier.name,
    storeUrl: supplier.url,
    location: supplier.location,
    shipping,
    deliveryTime,
    specifications,
    description,
    tags,
    scrapedAt: new Date().toISOString(),
    status: 'pending',
    supplier,
    dropshipping,
    profit,
    notes: '',
    category,
  };
}

export function isValid1688Url(url: string): boolean {
  return /1688\.com\/offer|detail\.1688\.com/.test(url);
}

export function validateHtmlContent(html: string): { valid: boolean; error?: string } {
  if (!html || html.trim().length < 100) {
    return { valid: false, error: 'HTML内容太短，请复制完整的页面源码' };
  }

  if (!html.includes('1688') && !html.includes('alibaba')) {
    return { valid: false, error: '未检测到1688页面内容，请确认复制的是1688商品页面' };
  }

  if (!html.includes('<title') || !html.includes('<body')) {
    return { valid: false, error: '不是有效的HTML内容，请确认复制的是页面源码' };
  }

  return { valid: true };
}
