import axios from 'axios'
import {when} from 'jest-when'
import {request} from '../src/http'

jest.mock('axios')

describe('when calling get', () => {
  const fakeRequest = axios.request as jest.MockedFunction<typeof axios.request>

  beforeEach(() => {
    jest.resetModules()

    when(fakeRequest)
      .calledWith(expect.anything())
      .mockReturnValue(Promise.resolve({status: 200, data: {some: 'JSON'}}))
  })

  it('should call axios with the appropriate url and payload', async () => {
    await request('url', 'get')

    expect(fakeRequest).toHaveBeenCalledWith({
      url: 'url',
      method: 'get',
      data: '{}',
      headers: expect.anything()
    })
  })
})

describe('when calling post', () => {
  const fakeRequest = axios.request as jest.MockedFunction<typeof axios.request>

  beforeEach(() => {
    jest.resetModules()

    when(fakeRequest)
      .calledWith(expect.anything())
      .mockReturnValue(Promise.resolve({status: 200, data: {some: 'JSON'}}))
  })

  it('should call axios with the appropriate url and payload', async () => {
    await request('url', 'post', '{"a": "JSON"}')

    expect(fakeRequest).toHaveBeenCalledWith({
      url: 'url',
      method: 'post',
      data: '{"a": "JSON"}',
      headers: expect.anything()
    })
  })
})
