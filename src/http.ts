import axios from 'axios'

export async function request(
  url: string,
  method: Method,
  data: string
): Promise<[number, Object]> {
  switch (method.toUpperCase()) {
    case 'POST':
      return post(url, data)
    case 'GET':
      return get(url)

    default:
      throw new Error(`unimplemented HTTP method: ${method}`)
  }
}

async function get(url: string): Promise<[number, Object]> {
  const response = await axios.get(url, {
    responseType: 'json',
    headers: {'Content-Type': 'application/json'}
  })

  const status = response.status
  const data = response.data as Object

  return [status, data]
}

async function post(url: string, payload: string): Promise<[number, Object]> {
  const response = await axios.post(url, payload, {
    responseType: 'json',
    headers: {'Content-Type': 'application/json'}
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
