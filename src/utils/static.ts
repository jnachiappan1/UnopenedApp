import { IconName } from "../assets/svg/iconsSvg";
import { PaymentMethodType } from "../components/card/paymentMethodCard";
import { PaymentMethodItem } from "../components/card/paymentMethodOption";
import { PayoutItem } from "../components/card/payoutCard";
import { ProductData } from "./types";

export const dashboardAnalyticsData = [
  { title: '12', subtitle: 'Active Listings', icon: 'productListPrimaryIcon' },
  { title: '03', subtitle: 'Pending Review', icon: 'pendingIcon' },
  { title: '30', subtitle: 'Sold Products', icon: 'boxIcon' },
  { title: '$550', subtitle: 'Wallet Balance', icon: 'walletPrimaryIcon' },
];
export const productData: ProductData[] = [
  {
    id: '1',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/10/353757091/WQ/VC/BK/199540713/whatsapp-image-2023-10-04-at-4-41-37-pm-1-500x500.jpeg',
    title: 'BoAt Airdopes 141',
    price: 100,
    daysAgo: 2,
    status: 'In Review',
  },
  {
    id: '2',
    image: 'https://s3.ap-south-1.amazonaws.com/happimobiles/product-main-images/fdf21db5-35a6-4c51-a8e0-829c8784d757.webp',
    title: 'Fire-Boltt Smartwatch',
    price: 280,
    daysAgo: 5,
    status: 'Sold',
  },
  {
    id: '3',
    image: 'https://x.imastudent.com/content/0061615_jbl-boombox-3-portable-bluetooth-speaker_500.png',
    title: 'JBL Speaker',
    price: 150,
    daysAgo: 3,
    status: 'Active',
  },
  {
    id: '4',
    image: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/121203-airpods-4.png',
    title: 'Apple AirPods Pro',
    price: 250,
    daysAgo: 1,
    status: 'Active',
  },
  {
    id: '5',
    image: 'https://m.media-amazon.com/images/I/712YXD2phFL._UF1000,1000_QL80_.jpg',
    title: 'Samsung Galaxy Mobile',
    price: 450,
    daysAgo: 4,
    status: 'In Review',
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
    subtitle: '@johndoe@22',
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
export const paymentOptions: PaymentMethodItem[] = [
  { title: 'Add Card', icon: 'addCard' },
  { title: 'Google Pay', icon: 'googlePay' },
  { title: 'Apple Pay', icon: 'applePay' },
  { title: 'PayPal', icon: 'payPal' },
];