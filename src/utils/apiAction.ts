import {API} from './api';
import axios from './axios';
import axiosmultipart from './axiosmultipart';

//Plan Owner Auth API Action

export const signInApi = async (type: string, data: any) => {
  const response = await axios.post(API.buyer.sign_in + type, data);
  return response;
};

// export const getPlanOwnerInfo = async () => {
//   const response = await axios.get(API.planOwner.plan_owner_info);
//   return response;
// };
