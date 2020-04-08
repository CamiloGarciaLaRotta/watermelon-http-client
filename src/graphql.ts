/**
 * Returns the stringified JSON payload which corresponds to the GraphQL operation.
 * If no operation is explicitly defined, it will default to `query`.
 *
 * @param data - the raw HTTP request payload
 * @returns `{"query": data}` or `{"mutation": data}`
 */
export function graphqlPayloadFor(
  rawData: string,
  rawVariables: string
): string {
  const data = minify(rawData)
  const variables = minify(rawVariables)
  return JSON.stringify({query: data, variables: JSON.parse(variables)})
}

/**
 * Returns the minified version of the string.
 * e.g. no line breaks and single spaces between each word
 */
const minify = (s: string): string => s.replace(/\s+/g, ' ').trim()
