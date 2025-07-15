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