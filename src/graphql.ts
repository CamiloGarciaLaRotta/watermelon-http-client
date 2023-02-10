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
 * @param {string} operationName - The entrypoint GraphQL operation if multiple are defined in `rawQuery`.
 * @returns {string} `{"query": <GraphQL query>, "variables": <variables>}`.
 */
export function graphqlPayloadFor(
  rawQuery: string,
  rawVariables: string,
  operationName = ''
): string {
  const query = minify(rawQuery)
  const minifiedVariables = minify(rawVariables)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const variables = JSON.parse(minifiedVariables)

  if (operationName === '') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return JSON.stringify({query, variables})
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return JSON.stringify({query, variables, operationName})
}
