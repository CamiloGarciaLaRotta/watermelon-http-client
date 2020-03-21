import axios from 'axios'

jest.mock('axios')

export async function post(
  url: string,
  payload: string
): Promise<[number, Object]> {
  const response = await axios.post(url, payload, {
    responseType: 'json',
    headers: {'Content-Type': 'application/json'}
  })

  const status = response.status
  const data = response.data as Object

  return [status, data]
}
