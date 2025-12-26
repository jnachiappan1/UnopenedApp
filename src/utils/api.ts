// export const base_url = 'http://45.248.33.161:5019';
// export const base_url = 'http://54.221.164.94';
// export const base_url = 'http://13.222.176.76';
export const base_url = 'https://api.unopenedapp.com';
// export const base_url = 'http://192.168.29.33:5019';

export const image_url = 'https://unopened-storage.s3.us-east-1.amazonaws.com';
export const google_api_key = 'AIzaSyDgYwd7eBxFOYR4rg6WN2jKlf9rYyopqgw';

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
    contact: `${base_url}/api/v1/contact-us`,
    addAddress: `${base_url}/api/v1/address`,
    getAddresses: `${base_url}/api/v1/address`,
    addressById: `${base_url}/api/v1/address/`,
    getPublishKey: `${base_url}/api/v1/payment/publish-key`,
    makePayment: `${base_url}/api/v1/payment/make-payment`,
    validateCoupon: `${base_url}/api/v1/coupon/validate`,
    applyCoupon: `${base_url}/api/v1/coupon/apply`,
    createShipping: `${base_url}/api/v1/shipping/create`,
    getShippingRates: `${base_url}/api/v1/shipping`,
    trackShipment: `${base_url}/api/v1/shipping`,
    addBankAccount: `${base_url}/api/v1/bank-account`,
    changeBankAccount: `${base_url}/api/v1/bank-account/change`,
    cashOut: `${base_url}/api/v1/cashout`,
    cashOutHistory: `${base_url}/api/v1/cashout/history`,
    cashOut_request: `${base_url}/api/v1/cashout/cashout-request`,
    notification: `${base_url}/api/v1/notification`,
    getProductAddress: `${base_url}/api/v1/product/`,
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
    getProductPriceCharge: `${base_url}/api/v1/common/product-price-charge`,
    getMyOrderList: `${base_url}/api/v1/product/purchase-product`,
    getScanProduct: `${base_url}/api/v1/product/scan-product?barcode=`,
  },
  location: {
    country: '/api/v1/common/countries',
    state: '/api/v1/common/states',
    city: '/api/v1/common/cities',
  },
  readNotification: `${base_url}/api/v1/notification/mark-all-read`,
  readSingleNotification: `${base_url}/api/v1/notification`,
};
