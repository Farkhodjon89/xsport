import gql from 'graphql-tag';

// export const PAGES = gql`
//   query PAGES($id: Int) {
//     pages(where: {id: $id}) {
//       nodes {
//         children(where: {orderby: {field: DATE, order: ASC}}) {
//           nodes {
//             slug
//             ... on Page {
//               title
//             }
//           }
//         }
//       }
//     }
//   }
// `

export const GETPAGEBYSLUG = gql`
  query PAGE($id: ID!) {
    page(id: $id, idType: URI) {
      content
      title
      slug
    }
  }
`;
