export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST'
export const DELETE_FROM_WISHLIST = 'DELETE_FROM_WISHLIST'
export const DELETE_ALL_FROM_WISHLIST = 'DELETE_ALL_FROM_WISHLIST'

// add to wishlist
export const addToWishlist = item => {
  return dispatch => {
    dispatch({ type: ADD_TO_WISHLIST, payload: item })
  }
}

// delete from wishlist
export const deleteFromWishlist = item => {
  return dispatch => {
    dispatch({ type: DELETE_FROM_WISHLIST, payload: item })
  }
}

//delete all from wishlist
export const deleteAllFromWishlist = () => {
  return dispatch => {
    dispatch({ type: DELETE_ALL_FROM_WISHLIST })
  }
}
