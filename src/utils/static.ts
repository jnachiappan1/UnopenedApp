import { IconName } from "../assets/svg/iconsSvg";
import { PaymentMethodType } from "../components/card/paymentMethodCard";
import { PayoutItem } from "../components/card/payoutCard";
import { Sort } from "../screens/buyerPortal/filterSortScreen";
import { OrderData, ProductData } from "./types";

export const dashboardAnalyticsData = [
  {
    key: 'active',
    title: '0',
    subtitle: 'Active Listings',
    icon: 'productListPrimaryIcon',
  },
  {
    key: 'in_review',
    title: '0',
    subtitle: 'Pending Review',
    icon: 'pendingIcon',
  },
  {
    key: 'sold',
    title: '0',
    subtitle: 'Sold Products',
    icon: 'boxIcon',
  },
  {
    key: 'wallet_balance',
    title: '$0',
    subtitle: 'Wallet Balance',
    icon: 'walletPrimaryIcon',
  },
];

export const productData: ProductData[] = [
  {
    id: '1',
    brand: 'boAt',
    name: 'BoAt Airdopes 141',
    barcode: '0001',
    category_id: 1,
    price: 100,
    msrp: 120,
    description: 'Wireless earbuds with long battery life',
    product_status: 'in_review',
    status: 'pending',
    createdAt: '2025-07-20T10:41:37.000Z',
    product_image: [
     
    ],
    daysAgo: 2,
  },
  {
    id: '2',
    brand: 'Fire-Boltt',
    name: 'Fire-Boltt Smartwatch',
    barcode: '0002',
    category_id: 1,
    price: 280,
    msrp: 320,
    description: 'Smartwatch with fitness tracking',
    product_status: 'sold',
    status: 'approved',
    createdAt: '2025-07-18T10:41:37.000Z',
    product_image: [
   
    ],
    daysAgo: 5,
  },
  {
    id: '3',
    brand: 'JBL',
    name: 'JBL Speaker',
    barcode: '0003',
    category_id: 1,
    price: 150,
    msrp: 200,
    description: 'Portable Bluetooth speaker',
    product_status: 'active',
    status: 'approved',
    createdAt: '2025-07-22T10:41:37.000Z',
    product_image: [
     
    ],
    daysAgo: 3,
  },
  {
    id: '4',
    brand: 'Apple',
    name: 'Apple AirPods Pro',
    barcode: '0004',
    category_id: 1,
    price: 250,
    msrp: 300,
    description: 'Noise-cancelling wireless earbuds',
    product_status: 'active',
    status: 'approved',
    createdAt: '2025-07-24T10:41:37.000Z',
    product_image: [
     
    ],
    daysAgo: 1,
  },
  {
    id: '5',
    brand: 'Samsung',
    name: 'Samsung Galaxy Mobile',
    barcode: '0005',
    category_id: 1,
    price: 450,
    msrp: 500,
    description: 'Android smartphone with AMOLED display',
    product_status: 'in_review',
    status: 'pending',
    createdAt: '2025-07-21T10:41:37.000Z',
    product_image: [
     
    ],
    daysAgo: 4,
  },
];

export const orderData: OrderData[] = [
  {
    id: '1',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/10/353757091/WQ/VC/BK/199540713/whatsapp-image-2023-10-04-at-4-41-37-pm-1-500x500.jpeg',
    title: 'BoAt Airdopes 141',
    price: 100,
    order_Id: 'ORD#11458',
    delivered_On:'15 Jun, 2025',
    status: 'Pending',
  },
  {
    id: '2',
    image: 'https://s3.ap-south-1.amazonaws.com/happimobiles/product-main-images/fdf21db5-35a6-4c51-a8e0-829c8784d757.webp',
    title: 'Fire-Boltt Smartwatch',
    price: 280,
    order_Id: 'ORD#11459',
    delivered_On:'15 Jun, 2025',
    status: 'In Transit',
  },
  {
    id: '3',
    image: 'https://x.imastudent.com/content/0061615_jbl-boombox-3-portable-bluetooth-speaker_500.png',
    title: 'JBL Speaker',
    price: 150,
    order_Id: 'ORD#11460',

    delivered_On:'15 Jun, 2025',
    status: 'Delivered',
  },
  {
    id: '4',
    image: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/121203-airpods-4.png',
    title: 'Apple AirPods Pro',
    price: 250,
    order_Id:'ORD#11461',
    delivered_On:'15 Jun, 2025',
    status: 'Delivered',
  },
  {
    id: '5',
    image: 'https://m.media-amazon.com/images/I/712YXD2phFL._UF1000,1000_QL80_.jpg',
    title: 'Samsung Galaxy Mobile',
    price: 450,
    order_Id:'ORD#11462',
    delivered_On:'15 Jun, 2025',
    status: 'In Transit'
  },
];
export const salesData = [
  {
    id: '1',
    status: 'In Transit',
    title: 'JBL Flip 6 Bluetooth Speaker',
    date: '12 June 2025',
    buyer: 'Ravi Mehta',
    price: 100,
    image: 'https://m.media-amazon.com/images/I/712YXD2phFL._UF1000,1000_QL80_.jpg',
  },
  {
    id: '2',
    status: 'Delivered',
    title: 'Apple AirPods Pro',
    date: '15 June 2025',
    buyer: 'Sophia Chen',
    price: 250,
    image: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/121203-airpods-4.png',
  },
];


export const transactions = [
  {
    id: '1',
    title: 'Sold: Apple AirPods Pro',
    dateTime: 'Jun 14, 2025 | 12:00',
    amount: 100,
    type: 'credit',
  },
  {
    id: '2',
    title: 'Withdrawal via Venmo',
    dateTime: 'Jun 15, 2025 | 14:30',
    amount: -150,
    type: 'debit',
  },
  {
    id: '3',
    title: 'Added Funds via Card',
    dateTime: 'Jun 16, 2025 | 09:45',
    amount: 300,
    type: 'add',
  },
  {
    id: '4',
    title: 'Refund for Cancelled Order',
    dateTime: 'Jun 17, 2025 | 11:15',
    amount: 250,
    type: 'credit',
  },
  {
    id: '5',
    title: 'Withdrawal via Rupay',
    dateTime: 'Jun 18, 2025 | 13:05',
    amount: -150,
    type: 'debit',
  },
];
export const pendingTranferData = [
  {
    id: '1',
    title: 'Apple Watch Series 8',
    status: 'In Transit',
    date: 'Jun 21, 2025',
    price: 100,
    isExpected: true,
  },
  {
    id: '2',
    title: 'Samsung Galaxy S22',
    status: 'In Transit',
    date: 'May 15, 2025',
    price: 799,
    isExpected: false,
  },
  {
    id: '3',
    title: 'Google Pixel 7',
    status: 'In Transit',
    date: 'Jul 10, 2025',
    price: 599,
    isExpected: true,
  },
];

export const categoryOptions = [
  {
    _id: '1',
    type: 'Category',
    name: 'Electronics',
    value: 'electronics',
    createdAt: '',
    updatedAt: '',
    __v: 0,
  },
  {
    _id: '2',
    type: 'Category',
    name: 'Fashion',
    value: 'fashion',
    createdAt: '',
    updatedAt: '',
    __v: 0,
  },
  {
    _id: '3',
    type: 'Category',
    name: 'Home',
    value: 'home',
    createdAt: '',
    updatedAt: '',
    __v: 0,
  },
];
export const paymentMethods: PaymentMethodType[] =  [
  {
    id: 2,
    title: 'Venmo',
    icon: 'venmo',
  },
  {
    id: 1,
    title: 'Cash App',
    icon: 'cashApp', 
  },
];


export const payoutHistory: PayoutItem[] = [
  {
    id: '1',
    title: 'Venmo Payment Method',
    dateTime: '25 June 2025 |12:00',
    amount: 100,
    status: 'Success',
  },
  {
    id: '2',
    title: 'Cash App Transfer',
    dateTime: '26 June 2025 |14:30',
    amount: 250,
    status: 'Success',
  },
  {
    id: '3',
    title: 'Cash Withdrawal',
    dateTime: '27 June 2025 |09:15',
    amount: 500,
    status: 'Pending',
  },
  {
    id: '4',
    title: 'Cash Withdrawal',
    dateTime: '28 June 2025 |11:45',
    amount: 75,
    status: 'Failed',
  },
  {
    id: '5',
    title: 'Venmo Payment Method',
    dateTime: '29 June 2025 |16:00',
    amount: 150,
    status: 'Success',
  },
];
export const quickAmounts = [10, 20, 50, 100, 120, 150];
export type PaymentMethodItem = {
  title: string;
  icon: IconName;
};

export const paymentOptions: PaymentMethodItem[] = [
  { title: 'Add Card', icon: 'addCard' },
  { title: 'Google Pay', icon: 'googlePay' },
  { title: 'Apple Pay', icon: 'applePay' },
  { title: 'PayPal', icon: 'payPal' },
];

export const products = [
  {
    id: 1,
    name: 'Google Pixel 6',
    description: 'Lightly used, no scratches, includes original box',
    price: '$350',
    originalPrice: '$600',
    image: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/121203-airpods-4.png',
  },
  {
    id: 2,
    name: 'OnePlus 9 Pro',
    description: 'Mint, comes with all original accessories',
    price: '$700',
    originalPrice: '$900',
    image: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/121203-airpods-4.png',
  },
  {
    id: 3,
    name: 'Samsung Galaxy S21',
    description: 'like new, with screen protector on',
    price: '$400',
    originalPrice: '$800',
    image: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/121203-airpods-4.png',
  },
  {
    id: 4,
    name: 'AirPods Pro 2',
    description: 'Sealed package with warranty card and receipt',
    price: '$500',
    originalPrice: '$1000',
    image: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/121203-airpods-4.png',
  }
];
export const bannerData :any= [
  {
    id: '1',
    titleLines: ['100% Unopened &', 'Brand-New Products'],
    subtitleLines: ['Brand-new. Never opened.', 'Guaranteed.'],
    image: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/121203-airpods-4.png',

  },
  
  // Add more if needed
];

export const sortByList: Sort[] = [
  { id: 'newest_first', name: 'Newest First' },
  { id: 'price_low_to_high', name: 'Price: Low to High' },
  { id: 'price_high_to_low', name: 'Price: High to Low' },
];