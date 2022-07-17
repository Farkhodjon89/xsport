import gql from 'graphql-tag'

export const PAGESETTINGS = gql`
  query PAGESETTINGS($id: ID!) {
    productCategory(id: $id, idType: SLUG) {
      name
      slug
      
      children(where: {orderby: MENU_ORDER}) {
        nodes {
          children(where: {orderby: MENU_ORDER}) {
            nodes {
              children(where: {orderby: MENU_ORDER}) {
                nodes {
                  children(where: {orderby: MENU_ORDER}) {
                    nodes {
                      name
                      slug
                    }
                  }
                  name
                  slug
                }
              }
              name
              slug
            }
          }
        }
      }
    }
  }
`

