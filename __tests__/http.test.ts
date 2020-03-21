import axios from 'axios'
import {when} from 'jest-when'
import {post} from '../src/http'

jest.mock('axios')

describe('when calling post', () => {
  const fakePost = axios.post as jest.MockedFunction<typeof axios.post>

  beforeEach(() => {
    jest.resetModules()

    when(fakePost)
      .calledWith('a_url', '{ a: payload }')
      .mockReturnValue(Promise.resolve({status: 200, data: {some: 'JSON'}}))
  })

  it('should call axios with the appropriate url and payload', async () => {
    await post('a_url', '{ a: payload }')

    expect(fakePost).toHaveBeenCalledWith('a_url', '{ a: payload }', {
      headers: {'Content-Type': 'application/json'},
      responseType: 'json'
    })
  })
})
