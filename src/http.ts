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
<<<<<<< HEAD
  data = '{}'
): Promise<[number, Object, Object]> {
  try {
    const response = await axios.request({
      url,
      method,
      data,
      headers: {'Content-Type': 'application/json'}
    })
=======
  data = '{}',
  headers: string
): Promise<[number, Object]> {
  switch (method.toUpperCase()) {
    case 'POST':
      return post(url, data, headers)
    case 'GET':
      return get(url, headers)
>>>>>>> b01610cfde9760085915318c127f17b016fec695

    const status = response.status
    const headers = response.headers
    const payload = response.data as Object

<<<<<<< HEAD
    return [status, headers, payload]
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      const status = error.response.status
      const headers = error.response.headers
      const payload = error.response.data as Object
=======
async function get(url: string, headers: string): Promise<[number, Object]> {
  const response = await axios.get(url, {
    responseType: 'json',
    headers: headers
  })
>>>>>>> b01610cfde9760085915318c127f17b016fec695

      return [status, headers, payload]
    }

<<<<<<< HEAD
    // Something happened in setting up the request that triggered an error
    return [
      500,
      '',
      `request could not be generated: ${JSON.stringify(error.message)}`
    ]
  }
=======
async function post(url: string, payload: string, headers: string): Promise<[number, Object]> {
  const response = await axios.post(url, payload, {
    responseType: 'json',
    headers: headers
  })

  const status = response.status
  const data = response.data as Object

  return [status, data]
>>>>>>> b01610cfde9760085915318c127f17b016fec695
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
