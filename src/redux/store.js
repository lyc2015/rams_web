import { createStore } from "redux";
import reducer from "./reducer";

const store = createStore(reducer);

export default store;


//お客様登録ページのstore設定
//import { createStore, applyMiddleware, combineReducers } from 'redux';
// import thunk from 'redux-thunk';
// import dataReducer  from '../redux/customerRegister/reducers';
// import reducer from "./reducer";


// const rootReducer = combineReducers({
//   data: dataReducer,
// });

// const store = createStore(rootReducer, applyMiddleware(thunk));

// export default store;
