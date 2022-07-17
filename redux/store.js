import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createWrapper } from 'next-redux-wrapper'
import thunk from 'redux-thunk'
import rootReducer from './reducers/rootReducer'

const makeConfiguredStore = reducer =>
  createStore(reducer, undefined, composeWithDevTools(applyMiddleware(thunk)))

const makeStore = () => {
  const isServer = typeof window === 'undefined'

  if (isServer) {
    return makeConfiguredStore(rootReducer)
  } else {
    const { persistStore, persistReducer } = require('redux-persist')
    const storage = require('redux-persist/lib/storage').default

    const persistConfig = {
      key: 'nextjs',
      storage
    }

    const persistedReducer = persistReducer(persistConfig, rootReducer)
    const store = makeConfiguredStore(persistedReducer)

    store.__persistor = persistStore(store)

    return store
  }
}

export const store = createWrapper(makeStore)
