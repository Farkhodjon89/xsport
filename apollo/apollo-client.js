import fetch from 'node-fetch'
import { ApolloClient } from '@apollo/client'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'

import introspectionQueryResultData from './fragment-types'
import { GRAPHQL_URL, WP_TOKEN } from './wp-config'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
})

// const defaultOptions = {
//   watchQuery: {
//     fetchPolicy: 'no-cache',
//     errorPolicy: 'ignore'
//   },
//   query: {
//     fetchPolicy: 'no-cache',
//     errorPolicy: 'all'
//   }
// }

export const middleware = new ApolloLink((operation, forward) => {
  const authNeededQueries = ['ORDER', 'UpdateCustomer', 'Customer', 'CustomerOrders', 'CustomerOrder', 'ConvertPoints']

  let token = operation.getContext().customerToken || WP_TOKEN

  if (authNeededQueries.includes(operation.operationName)) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        Authorization: `Bearer ${token}`
      }
    }))
  }

  return forward(operation)
})

export const afterware = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    return response
  })
})

const client = new ApolloClient({
  link: middleware.concat(
    afterware.concat(
      createHttpLink({
        uri: GRAPHQL_URL,
        fetch: fetch
      })
    )
  ),
  cache: new InMemoryCache({ fragmentMatcher })
  // defaultOptions: defaultOptions
})

export default client
