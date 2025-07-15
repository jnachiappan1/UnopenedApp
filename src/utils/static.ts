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
    image: 'https://via.placeholder.com/150',
    title: 'BoAt Airdopes 141',
    price: 100,
    daysAgo: 2,
    status: 'In Review',
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/150',
    title: 'Fire-Boltt Smartwatch',
    price: 280,
    daysAgo: 5,
    status: 'Sold',
  },
  {
    id: '3',
    image: 'https://via.placeholder.com/150',
    title: 'JBL Speaker',
    price: 150,
    daysAgo: 3,
    status: 'Active',
  },
  {
    id: '4',
    image: 'https://via.placeholder.com/150',
    title: 'Apple AirPods Pro',
    price: 250,
    daysAgo: 1,
    status: 'Active',
  },
  {
    id: '5',
    image: 'https://via.placeholder.com/150',
    title: 'Samsung Galaxy Mobile',
    price: 450,
    daysAgo: 4,
    status: 'In Review',
  },
];