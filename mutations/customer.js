import gql from "graphql-tag";
import { CustomerFragment } from "../queries/customer";

export const UPDATE_CUSTOMER = gql`
mutation UpdateCustomer($mutationId: String! $firstName: String, $lastName: String, $country: CountriesEnum, $city: String, $address: String, $phone: String) {
  updateCustomer(input: {clientMutationId: $mutationId, firstName: $firstName, lastName: $lastName, billing: {phone: $phone, address1: $address, city: $city, country: $country}}) {
    customer {
      ..._Customer
    }
  }
}
${CustomerFragment}
`;
