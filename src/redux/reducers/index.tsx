import user from './user/UserReducer';
import app from './app/AppReducer';
// add multiple reducer in this method
const reducers = {
  user,
  app,
};

export default reducers;
