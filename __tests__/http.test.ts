import axios from 'axios'
import {when} from 'jest-when'
import {request} from '../src/http'

jest.mock('axios')

describe('when calling get', () => {
  const fakeGet = axios.get as jest.MockedFunction<typeof axios.get>

  beforeEach(() => {
    jest.resetModules()

    when(fakeGet)
      .calledWith('url')
      .mockReturnValue(Promise.resolve({status: 200, data: {some: 'JSON'}}))
  })

  it('should call axios with the appropriate url and payload', async () => {
    await request('url', 'get')

    expect(fakeGet).toHaveBeenCalledWith('url', {
      headers: {'Content-Type': 'application/json'},
      responseType: 'json'
    })
  })
})

describe('when calling post', () => {
  const fakePost = axios.post as jest.MockedFunction<typeof axios.post>

  beforeEach(() => {
    jest.resetModules()

    when(fakePost)
      .calledWith('url', '{"a": "JSON"}')
      .mockReturnValue(Promise.resolve({status: 200, data: {some: 'JSON'}}))
  })

  it('should call axios with the appropriate url and payload', async () => {
    await request('url', 'post', '{"a": "JSON"}')

    expect(fakePost).toHaveBeenCalledWith('url', '{"a": "JSON"}', {
      headers: {'Content-Type': 'application/json'},
      responseType: 'json'
    })
  })
})

describe('when calling unimplemented method', () => {
  it('should throw unimplemented error', async () => {
    await expect(request('url', 'delete', '')).rejects.toThrow()
  })
})
