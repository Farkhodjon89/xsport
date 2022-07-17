import gql from 'graphql-tag'

const COUPON = gql`
  query COUPON($id: ID!) {
    coupon(id: $id, idType: CODE) {
      code
      discountType
      amount
      date
      usageLimitPerUser
    }
  }
`

export default COUPON
