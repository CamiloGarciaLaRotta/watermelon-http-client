import axios, {Method} from 'axios'

/**
 * Send an HTTP request with JSON as content and response type.
 *
 * @param {string} url - The endpoint to send the request to.
 * @param {Method} method - The HTTP method for the request, e.g `get, GET, post, POST`.
 * @param {string} data - The JSON encoded payload if any.
 * @param {object} headers - The JSON encoded custom headers.
 * @returns {Array} `[status code, response body]`.
 */
export async function request(
  url: string,
  method: Method,
  data = '{}',
  headers: Object = {}
): Promise<[number, Object, Object]> {
  try {
    const response = await axios.request({
      url,
      method,
      data,
      headers
    })

    const status = response.status
    const responseHeaders = response.headers
    const payload = response.data

    return [status, responseHeaders, payload]
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      const status = error.response.status
      const responseHeaders = error.response.headers
      const payload = error.response.data as Object

      return [status, responseHeaders, payload]
    }

    // Something happened in setting up the request that triggered an error
    return [
      500,
      '',
      `request could not be generated: ${JSON.stringify(error.message)}`
    ]
  }
}
