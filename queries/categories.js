import gql from 'graphql-tag';

const CATEGORIES = gql`
  query CATEGORIES {
    productCategories(first: 200, where: { hideEmpty: true, parent: 0, orderby: MENU_ORDER }) {
      nodes {
        count
        databaseId
        name
        slug
        image {
          sourceUrl
        }
        children(first: 200, where: { hideEmpty: true, orderby: MENU_ORDER }) {
          nodes {
            count
            slug
            name
            databaseId
            children(first: 200, where: { hideEmpty: true, orderby: MENU_ORDER }) {
              nodes {
                count
                slug
                name
                databaseId
                children(first: 200, where: { hideEmpty: true, orderby: MENU_ORDER }) {
                  nodes {
                    count
                    slug
                    name
                    databaseId
                    children(first: 200, where: { hideEmpty: true, orderby: MENU_ORDER }) {
                      nodes {
                        count
                        slug
                        name
                        databaseId
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default CATEGORIES;
