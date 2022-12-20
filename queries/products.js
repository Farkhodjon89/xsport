import gql from 'graphql-tag'
import { _Product, _SimpleProduct, _VariableProduct } from './fragments'

const PRODUCTS = gql`
  query PRODUCTS(
    $first: Int
    $day: Int
    $month: Int
    $year: Int
    $after: String
    $categories: [String]
    $filters: [ProductTaxonomyFilterInput]
    $onSale: Boolean
    $featured: Boolean
    $search: String
    $orderBy: [ProductsOrderbyInput]
  ) {
    products(
      first: $first
      after: $after
      where: {
        status: "publish"
        stockStatus: IN_STOCK
        onSale: $onSale
        featured: $featured
        categoryIn: $categories
        taxonomyFilter: { and: $filters }
        search: $search
        orderby: $orderBy
        dateQuery: { day: $day, month: $month, year: $year }
      }
    ) {
      activeTerms {
        paColors {
          name
          slug
          color
        }
        paSizes {
          name
          slug
        }
        paBrands {
          name
          slug
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
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
  ${_Product}
  ${_SimpleProduct}
  ${_VariableProduct}
`

export const PRODUCTS_SLUG = gql`
  query PRODUCTS($after: String) {
    products(
      first: 100
      after: $after
      where: { status: "publish", stockStatus: IN_STOCK }
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        slug
      }
    }
  }
`

export default PRODUCTS
