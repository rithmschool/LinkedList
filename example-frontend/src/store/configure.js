import { compose, createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';

function configureStore() {
  // redux chrome dev tools extension
  const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
      : compose;

  const enhancer = composeEnhancers(
    applyMiddleware(thunk)
    // other store enhancers if any
  );

  const store = createStore(rootReducer, enhancer);

  return store;
}

export default configureStore;
