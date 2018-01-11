const DEFAULT_STATE = {
  name: null,
  email: null,
  handle: null,
  logo: null,
  employees: [],
  jobs: [],
  error: null
};

const companyReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    default:
      return { ...state };
  }
};

export default companyReducer;
