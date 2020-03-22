type Operation = 'query' | 'mutation'

const MUTATION_OP: Operation = 'mutation'

export function graphqlPayloadFor(data: string): string {
  if (data.startsWith(MUTATION_OP)) {
    return JSON.stringify({mutation: data})
  }

  return JSON.stringify({query: data})
}
