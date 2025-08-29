import axios from 'axios';
import {store} from '../redux/store';
import { base_url } from './api';

const instance = axios.create({
  baseURL: base_url,
  timeout: 300000,
});
instance.interceptors.request.use(
  function (config: any) {
    const storeState = store.getState();
    const accessToken = storeState?.user?.token || null;
    if (accessToken) {
      config.headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + accessToken,
      };
    } else {
      config.headers = {
        Accept: 'application/json',
        "Content-Type": "multipart/form-data",
        Authorization: '',
      };
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  async response => {
    if (response.data?.statusCode === 200 || response?.status === 200) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response.data);
    }
  },

  function (error) {
    console.log(error,"error.response------");

    if (error?.response) {
      
      if (error.response?.data) {
        return Promise.reject(error.response?.data);
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
