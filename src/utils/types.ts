export interface IUser {
  id: number | null | undefined;
  user_id: string | null | undefined;
  first_name: string | null | undefined;
  last_name: string | null | undefined;
  email: string | null | undefined;
  country_code: string | number | null | undefined;
  country: string | null | undefined;
  phone_number: string | null | undefined;
  referral_code: string | null | undefined;
  currency: string | null | undefined;
  password: string | null | undefined;
  role: string | null | undefined;
  area: string | null | undefined;
  city: string | null | undefined;
  address: string | null | undefined;
  profile_picture: string | number | null | undefined;
  verify_account: number | null | undefined;
  biometric_lock: number | null | undefined;
  status: string | null | undefined;
  registered_by: string | null | undefined;
  refer_friends_with: string | null | undefined;
  fcmToken: string | null | undefined;
  business_account: number | null | undefined;
  createdAt: string | null | undefined;
  updatedAt: string | null | undefined;
}
export type errorMsg = {message: ''; status: 'error'};
export interface IUserState {
  userData: IUser | null | any;
  token: string | null;
  selectedLanguage: string | null;
  isOnboard: boolean | null | undefined | any;
  fcmToken: string | null;
  isOnline: boolean;
  driverId: any | null;
  userType: string | null | undefined;
  rideId: any;
}
export interface ProductCategory {
  id: number
  name: string
  status: string
  createdAt: string
  updatedAt: string
}
export interface ProductImage {
  id: number;
  product_id: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}
export interface ProductData {
  id: number
  brand: string
  name: string
  category_id: number
  user_id: number
  buyer_id: number
  msrp: number
  price: number
  barcode: string
  description: string
  status: string
  product_status: string
  product_activity_status: string
  createdAt: string
  updatedAt: string
  product_image: ProductImage[]
  product_category: ProductCategory
  product_user: ProductUser
  buyer_user: BuyerUser
}
export interface ProductUser {
  id: number
  full_name: string
  email: string
  country_code: string
  phone_number: string
  address: string
  country: string
  state: string
  city: string
  pincode: string
  gender: string
  password: any
  verify_account: boolean
  status: string
  fcmToken: any
  profile_picture: any
  createdAt: string
  updatedAt: string
}
export interface BuyerUser {
  id: number
  full_name: string
  email: string
  country_code: string
  phone_number: string
  address: string
  country: string
  state: string
  city: string
  pincode: string
  gender: string
  password: any
  verify_account: boolean
  status: string
  fcmToken: any
  profile_picture: string
  createdAt: string
  updatedAt: string
}

export interface OrderData {
  id: string;
  title: string;
  price: number;
  order_Id: string;
  delivered_On:string;
  image: string;
  status: string;
}
export interface ProductDetail {
  name: string;
  brand: string;
  category: string;
  msrp: string;
  listingPrice: string;
  description: string;
  images: string[];
  sku: any;
}
export interface Product {
  description: string;
  originalPrice: string;
  id: number;
  name: string;
  price: string;
  image: string;
}
export type AlertState = {
  isVisible: boolean;
  type: 'info' | 'delete' | 'success' | 'error';
  title?: string;
  description?: string;
  onDeletePress?: () => void;
  onDonePress?: () => void;
  doneText?: string;
  deleteText?: string;
};

export interface CategoryAPIResponse {
  status: string;
  message: string;
  data: {
    category: Array<{
      id: number;
      name: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };
}
export type selectedCountryType = {
  callingCode: string[];
  cca2: string;
  currency: string[];
  flag: string;
  name: string;
  region: string;
  subregion: string;
};

export type ContactSupportType = {
  full_name: string
  country_code: string
  phone_number: string
  email: string
  message: string
  product_id: number
};

export interface AddressPayloadType {
  full_name: string;
  phone_number: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  country_code: string;
}

export interface AddressType {
  id: number;
  full_name: string;
  phone_number: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  country_code: string;
  created_at: string;
  updated_at: string;
}
export interface CouponsItem {
  id: number;
  code: string;
  title: string;
  subTitle: string;
  usage_limit: number;
  start_date: string;
  end_date: string;
  type: string;
  minPurchaseAmount: string;
  maxDiscountAmount: string;
  applicableCategories: string[];
  applicableUser: string[];
  isSpecificCoupon: number;
  isExpired: number;
  status: string;
  count: number;
  createdAt: string;
  updatedAt: string;
  is_available: boolean;
}