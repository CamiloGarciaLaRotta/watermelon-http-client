import axios from 'axios'
import {request} from '../src/http'

describe('calling request', () => {
  const fakeRequest = (axios.request = jest.fn().mockImplementation(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Promise.resolve({status: 200, data: {}, headers: {}})
  }))

  beforeEach(() => jest.resetModules())

  it('should call axios with the appropriate url and payload for GET', async () => {
    await request('url', 'get', '{"some": "JSON"}', {some: 'headers'})

    expect(fakeRequest).toHaveBeenCalledWith({
      url: 'url',
      method: 'get',
      data: '{"some": "JSON"}',
      headers: {some: 'headers'}
    })
  })

  it('should call axios with the appropriate url and payload for POST', async () => {
    await request('url', 'post', '{"some": "JSON"}', {})

    expect(fakeRequest).toHaveBeenCalledWith({
      url: 'url',
      method: 'post',
      data: '{"some": "JSON"}',
      headers: {}
    })
  })
})
