import * as core from '@actions/core'
import {run} from '../src/main'
import {request} from '../src/http'
import {when} from 'jest-when'

jest.mock('../src/http')

describe('when running the action with valid inputs', () => {
  const fakeRequest = request as jest.MockedFunction<typeof request>

  beforeEach(() => {
    jest.resetModules()

    when(fakeRequest)
      .calledWith('url', expect.anything(), expect.anything(), {
        some: 'input-headers'
      })
      .mockReturnValue(
        Promise.resolve([200, {some: 'response-headers'}, {some: 'JSON'}])
      )

    process.env['INPUT_URL'] = 'url'
  })

  afterEach(() => {
    delete process.env['INPUT_URL']
  })

  it('should log the correct values for GraphQL', async () => {
    process.env['INPUT_METHOD'] = 'GET'
    process.env['INPUT_GRAPHQL'] = '{ some { mutation } }'
    process.env['INPUT_VARIABLES'] = '{"some": "variables"}'
    process.env['INPUT_HEADERS'] = '{"some": "input-headers"}'

    const infoMock = jest.spyOn(core, 'info')

    await run()

    expect(infoMock.mock.calls).toEqual([
      ['graphql: { some { mutation } }'],
      ['variables: {"some": "variables"}'],
      ['url: url'],
      ['method: POST'],
      ['headers: {"some":"input-headers"}'],
      [
        'data: {"query":"{ some { mutation } }","variables":{"some":"variables"}}'
      ],
      ['response status: 200'],
      ['response headers: {"some":"response-headers"}'],
      ['response body: {"some":"JSON"}']
    ])

    delete process.env['INPUT_METHOD']
    delete process.env['INPUT_GRAPHQL']
    delete process.env['INPUT_VARIABLES']
    delete process.env['INPUT_HEADERS']
  })

  it('should log the correct values for GET', async () => {
    process.env['INPUT_METHOD'] = 'GET'
    process.env['INPUT_HEADERS'] = '{"some": "input-headers" }'

    const fakeSetOutput = jest.spyOn(core, 'setOutput')
    const infoMock = jest.spyOn(core, 'info')

    await run()

    expect(infoMock.mock.calls).toEqual([
      ['url: url'],
      ['method: GET'],
      ['headers: {"some":"input-headers"}'],
      ['response status: 200'],
      ['response headers: {"some":"response-headers"}'],
      ['response body: {"some":"JSON"}']
    ])

    expect(fakeSetOutput).toBeCalledWith('status', '200')
    expect(fakeSetOutput).toBeCalledWith('headers', expect.anything())
    expect(fakeSetOutput).toBeCalledWith('response', '{"some":"JSON"}')

    delete process.env['INPUT_METHOD']
    delete process.env['INPUT_HEADERS']
  })

  it('should log the correct values for POST', async () => {
    process.env['INPUT_METHOD'] = 'POST'
    process.env['INPUT_HEADERS'] = '{"some": "input-headers"}'
    process.env['INPUT_DATA'] = '{"some": "data"}'

    const fakeSetOutput = jest.spyOn(core, 'setOutput')
    const infoMock = jest.spyOn(core, 'info')

    await run()

    expect(infoMock.mock.calls).toEqual([
      ['url: url'],
      ['method: POST'],
      ['headers: {"some":"input-headers"}'],
      ['data: {"some": "data"}'],
      ['response status: 200'],
      ['response headers: {"some":"response-headers"}'],
      ['response body: {"some":"JSON"}']
    ])

    expect(fakeSetOutput).toBeCalledWith('status', '200')
    expect(fakeSetOutput).toBeCalledWith('headers', expect.anything())
    expect(fakeSetOutput).toBeCalledWith('response', '{"some":"JSON"}')

    delete process.env['INPUT_METHOD']
    delete process.env['INPUT_HEADERS']
    delete process.env['INPUT_DATA']
  })
})
