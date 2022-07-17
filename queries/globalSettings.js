import gql from 'graphql-tag'

export const HOME_PAGE = gql`
  query HomePage {
    themeGeneralSettings {
      globalOptions {
        slider {
          button
          subtitle
          subtitle2
          title
          url
          image {
            sourceUrl
          }
          mobileImage {
            sourceUrl
          }
        }
        categories {
          title
          url
          image {
            sourceUrl
          }
        }
        
        banners {
        title
        button
        subtitle
        url
        mobimage {
          sourceUrl
        }
        image {
          sourceUrl
        }
      }
      }
    }
  }
`
