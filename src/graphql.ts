type Operation = 'query' | 'mutation'

const MUTATION_OP: Operation = 'mutation'

/**
 * Returns the stringified JSON payload which corresponds to the GraphQL operation.
 * If no operation is explicitly defined, it will default to `query`.
 *
 * @param data - the raw HTTP request payload
 * @returns `{"query": data}` or `{"mutation": data}`
 */
export function graphqlPayloadFor(data: string): string {
  if (data.startsWith(MUTATION_OP)) {
    return JSON.stringify({mutation: data})
  }

  return JSON.stringify({query: data})
}
