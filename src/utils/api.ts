export const base_url = 'http://45.248.33.161:5019';

export const image_url = '';

export const API = {
  buyer: {
    sign_up: `${base_url}/api/v1/auth/register`,
    sign_in: `${base_url}/api/v1/auth/login/`,
    verifyOtp: `${base_url}/api/v1/auth/verify/otp/`,
    resendOtp: `${base_url}/api/v1/auth/resend/otp/`,
    log_Out: `${base_url}/api/v1/auth/log-out`,
    getProfile: `${base_url}/api/v1/auth/me`,
    update_Profile: `${base_url}/api/v1/auth/update-profile`,
    change_Password: `${base_url}/api/v1/auth/change/password`,
    getWallet: `${base_url}/api/v1/wallet`,
    getTransactionList: `${base_url}/api/v1/wallet/transaction`,
  },
  seller: {
    sign_up: `${base_url}/api/v1/users/auth/create`,
  },
};
