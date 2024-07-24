import { createStore, combineReducers } from 'redux';
import transactionReducer from './reducers/transactionReducer';

const rootReducer = combineReducers({
  transactions: transactionReducer,
  // other reducers
});

const store = createStore(rootReducer);

export default store;
