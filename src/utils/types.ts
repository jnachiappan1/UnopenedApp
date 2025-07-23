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
export interface ProductData {
  id: string;
  title: string;
  price: number;
  daysAgo: number;
  image: string;
  status: string;
}