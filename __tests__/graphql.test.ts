import {graphqlPayloadFor} from '../src/graphql'

describe('calling graphqlPayloadFor', () => {
  it('should format mutations appropriately', () => {
    const inputMutation = `mutation ($reaction:AddReactionInput!) {
      addReaction(input:$reaction) {
        reaction
      }
    }`

    const inputVariables = `{
      "reaction": {
        "subjectId":"some-issue",
        "content":"ROCKET"
      }
    }`

    const expectedData =
      '{"query":"mutation ($reaction:AddReactionInput!) { addReaction(input:$reaction) { reaction } }","variables":{"reaction":{"subjectId":"some-issue","content":"ROCKET"}}}'

    expect(graphqlPayloadFor(inputMutation, inputVariables)).toMatch(
      expectedData
    )
  })

  it('should set operation to "query" by default', () => {
    expect(graphqlPayloadFor('foo { data }', '{}')).toMatch(
      '{"query":"foo { data }","variables":{}}'
    )
  })
})
