import gql from 'graphql-tag';

const CONTACTS = gql`
  query CONTACTS {
    themeGeneralSettings {
      globalOptions {
        contacts {
          workingHours
          mapLink
          address
          address2
          landmark
          id
        }
      }
    }
  }
`;
export default CONTACTS;
