import { FETCH_USER } from "../actionTypes";

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_USER:
      return { ...action.user };
    default:
      return state;
  }
};
