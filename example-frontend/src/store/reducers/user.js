const DEFAULT_STATE = {
  username: null,
  firstName: null,
  lastName: null,
  email: null,
  currentCompany: null,
  photo: null,
  experience: [],
  education: [],
  skills: [],
  error: null
};

const userReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    default:
      return { ...state };
  }
};

export default userReducer;