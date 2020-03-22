import {graphqlPayloadFor} from '../src/graphql'

describe('calling graphqlPayloadFor', () => {
  it('should format mutations appropriately', () => {
    expect(graphqlPayloadFor('query { country(code: "CO") { name } }')).toMatch(
      '{"query":"query { country(code: \\"CO\\") { name } }"}'
    )
  })

  it('should format mutations appropriately', () => {
    expect(
      graphqlPayloadFor('mutation { country(code: "CO") { name } }')
    ).toMatch('{"mutation":"mutation { country(code: \\"CO\\") { name } }"}')
  })

  it('should set operation to "query" by default', () => {
    expect(graphqlPayloadFor('foo { data }')).toMatch(
      '{"query":"foo { data }"}'
    )
  })
})
