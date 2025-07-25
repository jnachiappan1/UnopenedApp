export const base_url = 'http://45.248.33.161:5019';

export const image_url = '';

export const API = {
  buyer: {
    sign_up: `${base_url}/api/v1/auth/register`,
    sign_in: `${base_url}/api/v1/auth/login/`,
    verifyOtp: `${base_url}/api/v1/auth/verify/otp/`,
    resendOtp: `${base_url}/api/v1/auth/resend/otp/`,
    log_Out: `${base_url}/api/v1/auth/log-out`,
    delete: `${base_url}/api/v1/auth/delete-user`,
    getProfile: `${base_url}/api/v1/auth/me`,
    update_Profile: `${base_url}/api/v1/auth/update-profile`,
    change_Password: `${base_url}/api/v1/auth/change/password`,
    getWallet: `${base_url}/api/v1/wallet`,
    getTransactionList: `${base_url}/api/v1/wallet/transaction`,
  },
  seller: {
    sign_up: `${base_url}/api/v1/users/auth/create`,
    getCategory: `${base_url}/api/v1/common/category-list`,
    add_Product: `${base_url}/api/v1/product`,
    dashBoard_Count: `${base_url}/api/v1/product/count`,
    product_List: `${base_url}/api/v1/product`,
  },
};
