import { API } from './api';
import axios from './axios';
import axiosmultipart from './axiosmultipart';
import { ChangePasswordPayloadType, ResendInputPayloadType, SignUpPayloadType } from './payload';
import { ContactSupportType, AddressPayloadType, PaymentPayloadType } from './types';

//Plan Owner Auth API Action

export const signInApi = async (type: string, data: any) => {
  const response = await axios.post(API.buyer.sign_in + type, data);
  return response;
};
export const signUp = async (data: SignUpPayloadType) => {
  const response = await axios.post(API.buyer.sign_up, data);
  return response;
};
export const verifyOtpApi = async (type: string, payload: any) => {
  const response = await axios.post(API.buyer.verifyOtp + type, payload);
  return response;
};
export const resendOtpApi = async (type: string, payload: ResendInputPayloadType) => {
  const response = await axios.post(API.buyer.resendOtp + type, payload);
  return response;
};
export const logOutAPI = async () => {
  const response = await axios.patch(API.buyer.log_Out);
  return response;
};
export const deleteAPI = async () => {
  const response = await axios.delete(API.buyer.delete);
  return response;
};
export const viewProfile = async () => {
  const response = await axios.get(API.buyer.getProfile);
  return response;
};
export const updateProfile = async (data: globalThis.FormData) => {
  const response = await axiosmultipart.patch(API.buyer.update_Profile, data);
  return response;
};
export const changePassword = async (data: ChangePasswordPayloadType) => {
  const response = await axios.patch(API.buyer.change_Password, data);
  return response;
};
export const getWalletDetail = async () => {
  const response = await axios.get(API.buyer.getWallet);
  return response;
};
export const getTransactionList = async () => {
  const response = await axios.get(API.buyer.getTransactionList);
  return response;
};
export const addBankAccount = async (data: any) => {
  const response = await axios.post(API.buyer.addBankAccount, data);
  return response;
};
export const changeBankAccount = async (data: any) => {
  const response = await axios.patch(API.buyer.changeBankAccount, data);
  return response;
};

export const getBankAccount = async () => {
  const response = await axios.get(API.buyer.addBankAccount);
  return response;
};

export const cashOut = async (data: { amount: string }) => {
  const response = await axios.post(API.buyer.cashOut, data);
  return response;
};

export const getCashOutHistory = async () => {
  const response = await axios.get(API.buyer.cashOutHistory);
  return response;
};
export const getCashOutRequest = async () => {
  const response = await axios.get(API.buyer.cashOut_request);
  return response;
};
export const getCategoryDetail = async () => {
  const response = await axios.get(API.seller.getCategory);
  return response;
};
export const addProduct = async (data: FormData) => {
  console.log("dataaddProduct===", JSON.stringify(data));
  
  const response = await axiosmultipart.post(API.seller.add_Product, data);
  console.log(response,"response--");

  return response;
};
export const getSellerDashboardCount = async () => {
  const response = await axios.get(API.seller.dashBoard_Count);
  return response;
};
export const getSellerOwnProductList = async () => {
  const response = await axios.get(API.seller.product_List);
  return response;
};
export const getSellerProductByID = async (productID?: string | number | null | undefined) => {
  const response = await axios.get(API.seller.product_List + "/" + productID);
  return response;
};
export const getLegalcontent = async (type: string | null | undefined) => {
  const response = await axios.get(API.seller.getLegalcontent + type);
  return response;
};

export const updateProductStatus = async (
  productID: string | number | null | undefined,
  data: globalThis.FormData
) => {
  console.log("data", JSON.stringify(data));
  console.log("productID", productID);
  
  const response = await axiosmultipart.patch(API.seller.add_Product + "/" + productID, data);
  return response;
};


//Buyer Side API call
interface productListParams {
  search?: string;
  sort_by?: string;
  price?: string;
  category_id?: string;
  user_id?: number;
}
export const getProductList = async ({
  search,
  sort_by,
  price,
  category_id,
  user_id,
}: productListParams) => {
  try {
    const queryParts: string[] = [];
    if (search && search.trim() !== '') {
      queryParts.push(`search=${encodeURIComponent(search)}`);
    }
    if (sort_by && sort_by !== 'null') {
      queryParts.push(`sort_by=${encodeURIComponent(sort_by)}`);
    }
    if (price) {
      queryParts.push(`price=${encodeURIComponent(price)}`);
    }
    if (category_id) {
      const categoryIds = category_id.split(',');
      categoryIds.forEach(id => {
        queryParts.push(`category_id=${encodeURIComponent(id.trim())}`);
      });
    }
    if (user_id) {
      queryParts.push(`user_id=${encodeURIComponent(user_id.toString())}`);
    }
    const queryString = queryParts.join('&');
    const url = `${API.seller.getProductList}${queryString ? `?${queryString}` : ''}`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error('Error fetching product list:', error);
    throw error;
  }
};
export const getAllProductList = async (user_id?: number) => {
  try {
    let url = `${API.seller.getProductList}`;
    if (user_id) {
      url += `?user_id=${user_id}`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error('Error fetching product list:', error);
    throw error;
  }
};

// export const getPlanOwnerInfo = async () => {
//   const response = await axios.get(API.planOwner.plan_owner_info);
//   return response;
// };
export const getProductPriceDetail = async () => {
  const response = await axios.get(API.seller.getProductPrice);
  return response;
};
export const getProductPriceChargeDetail = async () => {
  const response = await axios.get(API.seller.getProductPriceCharge);
  return response;
};
export const getSalesProductList = async () => {
  const response = await axios.get(API.seller.sales_product_List);
  return response;
};
export const getProductDetailByID = async (productID?: string | number | null | undefined) => {
  const response = await axios.get(API.buyer.getProductList + "/" + productID);
  return response;
};

export const validateCoupon = async (data: { coupon_code: string; purchase_amount: number }) => {
  const response = await axios.post(API.buyer.validateCoupon, data);
  return response;
};
export const soldProduct = async (productId: string | number | null | undefined, payload?: { address_id: number }) => {
  const response = await axios.patch(`${API.seller.soldProduct}${productId}`, payload);
  return response.data;
};export const getMyOrderList = async () => {
  const response = await axios.get(API.seller.getMyOrderList);
  return response;
};

export const getCountriesAction = async ({
  page = 1,
  limit = 10,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}): Promise<any> => {
  let url = `${API.location.country}?page=${page}&limit=${limit}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  const response = await axios.get<any>(url);
  return response.data;
};
export const getStateAction = async ({
  page = 1,
  limit = 10,
  search,
  country,
}: {
  page: number;
  limit: number;
  search: string;
  country: string;
}): Promise<any> => {
  let url = `${API.location.state}?page=${page}&limit=${limit}&country=${country}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  const response = await axios.get<any>(url);
  return response.data;
};
export const getCityAction = async ({
  page = 1,
  limit = 10,
  search,
  country,
  state,
}: {
  page: number;
  limit: number;
  search: string;
  country: string;
  state: string;
}): Promise<any> => {
  let url = `${API.location.city}?page=${page}&limit=${limit}&country=${country}&state=${state}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  const response = await axios.get<any>(url);
  return response.data;
};

export const getScanProductDetail = async (scannedBarcode:string) => {
  const response = await axios.get(API.seller.getScanProduct+scannedBarcode);
  return response;
};

export const contactUs = async (payload: ContactSupportType) => {
  const response = await axios.post(API.buyer.contact, payload);
  return response;
};

export const addAddress = async (payload: AddressPayloadType) => {
  const response = await axios.post(API.buyer.addAddress, payload);
  return response;
};

export const getAddresses = async () => {
  const response = await axios.get(API.buyer.getAddresses);
  return response;
};
export const getAddressesByID = async (addressID: number) => {
  const response = await axios.get(API.buyer.getAddresses + "/" + addressID);
  return response;
};
export const getPublishKeyAction = async () => {
  const response = await axios.get(API.buyer.getPublishKey);
  return response;
};

export const makePayment = async (
  type: 'add_funds' | 'buy_product' | 'wallet_funds' | 'wallet_buy_product_funds',
  payload: { 
    amount?: string;
    address_id?: number;
    wallet_amount?: string;
  },
  productId?: string | number
) => {
  // Build URL dynamically
  let url = `${API.buyer.makePayment}/?type=${type}`;
  if (type !== 'add_funds' && productId !== undefined && productId !== null) {
    url += `&product_id=${productId}`;
  }
  const response = await axios.post(url, payload);
  return response;
};

export const applyCoupon = async (payload: {
  coupon_code: string;
  purchase_amount: number;
}) => {
  const response = await axios.post(API.buyer.applyCoupon, payload);
  return response;
};

export const createShipping = async (payload: { product_id: string; address_id: number }) => {
  const response = await axios.post(API.buyer.createShipping, payload);
  return response;
};

export const getShippingRates = async (shippingRecordId: number) => {
  const response = await axios.get(`${API.buyer.getShippingRates}/${shippingRecordId}/rates`);
  return response;
};

export const trackShipment = async (shipmentId: any) => {
  
  const response = await axios.get(`${API.buyer.trackShipment}/${shipmentId}/track`);
  return response;
};
export const getNotification = async () => {
  const response = await axios.get(API.buyer.notification);
  return response;
};

export const createCashOut = async (payload: PaymentPayloadType) => {
  const response = await axios.post(API.buyer.cashOut_request, payload);
  return response;
};