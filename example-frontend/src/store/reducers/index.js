import { combineReducers } from 'redux';
import companyReducer from './company';
import userReducer from './user';

const rootReducer = combineReducers({
  user: userReducer,
  company: companyReducer
});

export default rootReducer;
