import axios from 'axios'

/**
 * Send an HTTP request with JSON as content and response type.
 *
 * @param url - the endpoint to send the request to
 * @param method - the HTTP method for the request. e.g `get, GET, post POST`
 * @param data - the JSON encoded payload if any
 * @returns `[status code, response body]`
 */
export async function request(
  url: string,
  method: Method,
  data = '{}'
): Promise<[number, Object, Object]> {
  try {
    const response = await axios.request({
      url,
      method,
      data,
      headers: {'Content-Type': 'application/json'}
    })

    const status = response.status
    const headers = response.headers
    const payload = response.data as Object

    return [status, headers, payload]
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      const status = error.response.status
      const headers = error.response.headers
      const payload = error.response.data as Object

      return [status, headers, payload]
    }

    // Something happened in setting up the request that triggered an error
    return [
      500,
      '',
      `request could not be generated: ${JSON.stringify(error.message)}`
    ]
  }
}

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'
