import { combineReducers } from 'redux';
import authReducer from './authReducer'; // Ensure these paths are correct
import transactionReducer from './transactionReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  transactions: transactionReducer
});

export default rootReducer;
