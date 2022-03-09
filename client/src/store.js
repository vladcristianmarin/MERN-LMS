import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { sidebarReducer } from './reducers/sidebarReducers';

const reducer = combineReducers({
  sidebar: sidebarReducer
});

const inititalState = { sidebar: { isOpen: true } };

const middleware = [thunk];

const store = createStore(
  reducer,
  inititalState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
