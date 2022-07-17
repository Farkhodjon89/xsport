const fetch = require('node-fetch')
const fs = require('fs')
const { GRAPHQL_URL } = require('./wp-config')

fetch(GRAPHQL_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    variables: {},
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  }),
})
  .then((result) => result.json())
  .then((result) => {
    result.data.__schema.types = result.data.__schema.types.filter(
      (type) => type.possibleTypes !== null
    )
    fs.writeFile('./fragmentTypes.json', JSON.stringify(result.data), (err) => {
      if (err) {
        console.error('Error writing fragmentTypes file', err)
      } else {
      }
    })
  })
