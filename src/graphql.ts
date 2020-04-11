/**
 * Replace multiple spaces and newlines from a string.
 *
 * @param {string} s - The string to be minified.
 * @returns {string} The single line, single spaced string.
 */
const minify = (s: string): string => s.replace(/\s+/g, ' ').trim()

/**
 * Returns the stringified JSON payload which corresponds to the GraphQL operation.
 * If no operation is explicitly defined, it will default to `query`.
 *
 * @param {string} rawQuery - The stringified GraphQL query or mutation.
 * @param {string} rawVariables - The JSON mutation variables.
 * @returns {string} `{"query": <GraphQL query>, "variables": <variables>}`.
 */
export function graphqlPayloadFor(
  rawQuery: string,
  rawVariables: string
): string {
  const query = minify(rawQuery)
  const variables = minify(rawVariables)
  return JSON.stringify({query, variables: JSON.parse(variables)})
}
