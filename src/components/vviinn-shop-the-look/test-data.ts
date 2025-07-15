import { ShopTheLookHotspot, ShopTheLookProduct } from "./vviinn-shop-the-look";
import { BasicEventData } from "../../recommendation/events";

export const TEST_IMAGE_URL = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=350&h=468&fit=crop&crop=center";

export const TEST_HOTSPOTS: ShopTheLookHotspot[] = [
  {
    id: 'hotspot-1',
    position: { left: 0.62, top: 0.28, width: 0.11, height: 0.085 }, // Normalized positions (0-1)
    product: {
      title: 'Boss Sweater',
      price: { actual: 179 },
      image: { original: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=160&h=164&fit=crop&crop=center' },
      brand: 'Boss',
      productId: 'sweater-001'
    }
  },
  {
    id: 'hotspot-2',
    position: { left: 0.39, top: 0.62, width: 0.11, height: 0.085 },
    product: {
      title: 'Loose fit Pants',
      price: { actual: 45 },
      image: { original: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=160&h=164&fit=crop&crop=center' },
      brand: 'Casual',
      productId: 'pants-001'
    }
  },
  {
    id: 'hotspot-3',
    position: { left: 0.62, top: 0.89, width: 0.11, height: 0.085 },
    product: {
      title: 'Handball Shoes',
      price: { actual: 110 },
      image: { original: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=160&h=164&fit=crop&crop=center' },
      brand: 'Adidas',
      productId: 'shoes-001'
    }
  }
];

export const TEST_PRODUCTS: ShopTheLookProduct[] = [
  {
    id: 'sweaters-1',
    category: 'sweaters',
    products: [
      {
        title: 'Boss Sweater',
        price: { actual: 179 },
        image: { original: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=160&h=164&fit=crop&crop=center' },
        brand: 'Boss',
        productId: 'sweater-001'
      },
      {
        title: 'Cashmere Pullover',
        price: { actual: 199 },
        image: { original: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=164&fit=crop&crop=center' },
        brand: 'Luxury',
        productId: 'sweater-002'
      }
    ]
  },
  {
    id: 'trousers-1',
    category: 'trousers',
    products: [
      {
        title: 'Loose fit Pants Katrin',
        price: { actual: 45 },
        image: { original: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=160&h=164&fit=crop&crop=center' },
        brand: 'Casual',
        productId: 'pants-001'
      },
      {
        title: 'Slim Fit Chinos',
        price: { actual: 65 },
        image: { original: 'https://images.unsplash.com/photo-1506629905607-379d2c0bb018?w=160&h=164&fit=crop&crop=center' },
        brand: 'Smart',
        productId: 'pants-002'
      }
    ]
  },
  {
    id: 'shoes-1',
    category: 'shoes',
    products: [
      {
        title: 'Handball Special Shoes',
        price: { actual: 110 },
        image: { original: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=160&h=164&fit=crop&crop=center' },
        brand: 'Adidas',
        productId: 'shoes-001'
      },
      {
        title: 'Classic Sneakers',
        price: { actual: 89 },
        image: { original: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=160&h=164&fit=crop&crop=center' },
        brand: 'Nike',
        productId: 'shoes-002'
      }
    ]
  }
];

export const TEST_BASIC_EVENT_DATA: BasicEventData = {
  campaignTypeId: 'VPR',
  campaignTypeName: 'Similar Products',
  widgetVersion: '1.0.0'
};