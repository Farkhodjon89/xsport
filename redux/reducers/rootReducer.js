import cartReducer from './cartReducer'
import wishlistReducer from './wishlistReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  cartData: cartReducer,
  wishlistData: wishlistReducer
})

export default rootReducer
