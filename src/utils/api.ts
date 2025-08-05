export const base_url = 'http://45.248.33.161:5019';

export const image_url = 'http://45.248.33.161:5019/uploads/';

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
    getProductList: `${base_url}/api/v1/common/product-list`,
  },
  seller: {
    sign_up: `${base_url}/api/v1/users/auth/create`,
    getCategory: `${base_url}/api/v1/common/category-list`,
    add_Product: `${base_url}/api/v1/product`,
    dashBoard_Count: `${base_url}/api/v1/product/count`,
    product_List: `${base_url}/api/v1/product`,
    sales_product_List: `${base_url}/api/v1/product/sales-activity-product`,
    getProductDetailByID: `${base_url}/api/v1/common/product-list/`,
    soldProduct: `${base_url}/api/v1/product/purchase-product/`,
    getLegalcontent: `${base_url}/api/v1/common/legalcontent/`,
    getProductList: `${base_url}/api/v1/common/product-list`,
    getProductPrice: `${base_url}/api/v1/common/product-price`,
    getMyOrderList: `${base_url}/api/v1/product/purchase-product`,

  },
  location: {
    country: '/api/v1/helper/countries',
    state: '/api/v1/helper/states',
    city: '/api/v1/helper/cities',
  },
};
