import gql from 'graphql-tag'
import { _Product, _SimpleProduct, _VariableProduct } from './fragments'

const PRODUCT = gql`
  query PRODUCT($id: ID!) {
    product(id: $id, idType: SLUG) {
      ..._Product
      ... on SimpleProduct {
        ..._SimpleProduct
      }
      ... on VariableProduct {
        ..._VariableProduct
      }
      related(first: 4, where: { shuffle: true, stockStatus: IN_STOCK }) {
        nodes {
          ..._Product
          ... on SimpleProduct {
            ..._SimpleProduct
          }
          ... on VariableProduct {
            ..._VariableProduct
          }
        }
      }
    }
  }
  ${_Product}
  ${_SimpleProduct}
  ${_VariableProduct}
`
export default PRODUCT
