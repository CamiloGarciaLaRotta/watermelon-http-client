import axios from 'axios'

/**
 * Send an HTTP request with JSON as content and response type.
 *
 * @param url - the endpoint to send the request to
 * @param method - the HTTP method for the request. e.g `get, GET, post, POST`
 * @param data - the JSON encoded payload if any
 * @param headers - the JSON encoded custom headers
 * @returns `[status code, response body]`
 */
export async function request(
  url: string,
  method: Method,
  data = '{}',
  headers: string
): Promise<[number, Object]> {
  switch (method.toUpperCase()) {
    case 'POST':
      return post(url, data, headers)
    case 'GET':
      return get(url, headers)

    default:
      throw new Error(`unimplemented HTTP method: ${method}`)
  }
}

async function get(url: string, headers: string): Promise<[number, Object]> {
  const response = await axios.get(url, {
    responseType: 'json',
    headers: headers
  })

  const status = response.status
  const data = response.data as Object

  return [status, data]
}

async function post(url: string, payload: string, headers: string): Promise<[number, Object]> {
  const response = await axios.post(url, payload, {
    responseType: 'json',
    headers: headers
  })

  const status = response.status
  const data = response.data as Object

  return [status, data]
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
