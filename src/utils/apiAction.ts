import {API} from './api';
import axios from './axios';
import axiosmultipart from './axiosmultipart';
import { ChangePasswordPayloadType, ResendInputPayloadType, SignUpPayloadType } from './payload';

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
export const updateProfile = async (data: SignUpPayloadType) => {
  const response = await axios.patch(API.buyer.update_Profile, data);
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
export const getCategoryDetail = async () => {
  const response = await axios.get(API.seller.getCategory);
  return response;
};
export const addProduct = async (data: globalThis.FormData) => {
  const response = await axiosmultipart.post(API.seller.add_Product, data);
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
export const getSellerProductByID = async (productID?: string|number | null | undefined) => {
  const response = await axios.get(API.seller.product_List+"/"+productID);
  return response;
};
// export const getPlanOwnerInfo = async () => {
//   const response = await axios.get(API.planOwner.plan_owner_info);
//   return response;
// };
