import axios from 'axios';
import { base_url } from './api';
import { store } from '../redux/store';
import { showAlert } from '../components/cAlert';
import { saveUserData, setAuthToken } from '../redux/reducers/user/UserReducer';
import { SCREENS } from '../navigation/mainNavigation';
import * as RootNavigation from '../../RootNavigation';

const instance = axios.create({
  baseURL: base_url,
  timeout: 10000,
});
instance.interceptors.request.use(
  function (config: any) {
    const storeState = store.getState();
    const accessToken = storeState?.user?.token || null;

    if (accessToken) {
      config.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      };
    } else {
      config.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
    if (
      response.data?.statusCode === 200 ||
      response?.status === 200 ||
      response?.status === 201
    ) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response.data);
    }
  },
  function (error) {
    if (error?.response) {
      if (error.response?.status === 401) {
        const state = store.getState();
        const token = state?.user?.token;
        // If user is a guest (no token), do not show alert or redirect
        if (!token) {
          if (error.response?.data) {
            return Promise.reject(error.response?.data);
          }
          return Promise.reject(error);
        }
        setTimeout(() => {
          showAlert({
            isVisible: true,
            type: 'error',
            title: 'Unauthorized',
            description:
              error?.response?.data?.message ||
              'Your session has expired. Please log in again.',
            doneText: 'OK',
          });
          // errorMessage(error?.response?.data?.message);
        }, 750);
        store.dispatch(setAuthToken(null));
        store.dispatch(saveUserData(null));
        RootNavigation.navigate(SCREENS.LoginScreen);
      }
      if (error.response?.data) {
        return Promise.reject(error.response?.data);
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
