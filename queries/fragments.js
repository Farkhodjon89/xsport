import gql from 'graphql-tag'

export const _Product = gql`
  fragment _Product on Product {
    id
    databaseId
    sku
    slug
    name
    onSale
    type
    status
    description
    productCategories(where: { parent: 0 }) {
      nodes {
        slug
      }
    }
    image {
      sourceUrl
    }
    galleryImages {
      nodes {
        sourceUrl
      }
    }
  }
`

export const _SimpleProduct = gql`
  fragment _SimpleProduct on SimpleProduct {
    id
    databaseId
    stockQuantity
    paColors {
      nodes {
        name
      }
    }
    paSizes {
      nodes {
        name
      }
    }
    paBrands {
      nodes {
        name
      }
    }
    woocsRegularPrice
    woocsSalePrice
  }
`

export const _VariableProduct = gql`
  fragment _VariableProduct on VariableProduct {
    id
    databaseId
    woocsRegularPrice
    woocsSalePrice
    paColors {
      nodes {
        name
        color
      }
    }
    paSizes {
      nodes {
        name
      }
    }
    paBrands {
      nodes {
        name
      }
    }
    variations(where: { stockStatus: IN_STOCK }) {
      nodes {
        id
        databaseId
        stockQuantity
        sku
        name
        image {
          sourceUrl
        }
        color: attributes(where: { taxonomy: "pa_color" }) {
          nodes {
            value
            color
          }
        }
        size: attributes(where: { taxonomy: "pa_size" }) {
          nodes {
            value
          }
        }
      }
    }
  }
`
