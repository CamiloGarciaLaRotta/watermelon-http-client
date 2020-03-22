type Operation = 'query' | 'mutation'

const mutation_op: Operation = 'mutation'

export function graphqlPayloadFor(data: string): string {
  if (data.startsWith(mutation_op)) {
    return JSON.stringify({mutation: data})
  }

  return JSON.stringify({query: data})
}

