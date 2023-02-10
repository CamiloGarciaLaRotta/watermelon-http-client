import * as core from '@actions/core'
import * as http from '../src/http'
import {Logger} from '../src/log'
import {run} from '../src/main'

describe('when running the action with valid inputs', () => {
  jest
    .spyOn(http, 'request')
    .mockImplementation(async (): Promise<[number, Object, Object]> => {
      return Promise.resolve([200, {some: 'response-headers'}, {some: 'JSON'}])
    })
  const infoMock = jest.spyOn(Logger.prototype, 'info')
  const outputMock = jest.spyOn(core, 'setOutput')

  beforeEach(() => {
    jest.resetModules()

    process.env['INPUT_VERBOSE'] = 'true'
    process.env['INPUT_URL'] = 'url'
    process.env['INPUT_METHOD'] = 'GET'
    process.env['INPUT_HEADERS'] = '{"some": "input-headers"}'
  })

  afterEach(() => {
    delete process.env['INPUT_VERBOSE']
    delete process.env['INPUT_URL']
    delete process.env['INPUT_METHOD']
    delete process.env['INPUT_HEADERS']
  })

  it('should log the correct values for GET', async () => {
    await run()

    expect(infoMock.mock.calls).toEqual([
      ['url', 'url'],
      ['method', 'GET'],
      ['headers', '{"some":"input-headers"}'],
      ['fail_fast', 'false'],
      ['response status', 200],
      ['response headers', '{"some":"response-headers"}'],
      ['response body', '{"some":"JSON"}']
    ])

    expect(outputMock.mock.calls).toEqual([
      ['status', '200'],
      ['headers', expect.anything()],
      ['response', '{"some":"JSON"}']
    ])
  })

  it('should log the correct values for POST', async () => {
    process.env['INPUT_METHOD'] = 'POST'
    process.env['INPUT_DATA'] = '{"some": "data"}'

    await run()

    expect(infoMock.mock.calls).toEqual([
      ['url', 'url'],
      ['method', 'POST'],
      ['headers', '{"some":"input-headers"}'],
      ['data', '{"some": "data"}'],
      ['fail_fast', 'false'],
      ['response status', 200],
      ['response headers', '{"some":"response-headers"}'],
      ['response body', '{"some":"JSON"}']
    ])

    expect(outputMock.mock.calls).toEqual([
      ['status', '200'],
      ['headers', expect.anything()],
      ['response', '{"some":"JSON"}']
    ])

    delete process.env['INPUT_METHOD']
    delete process.env['INPUT_DATA']
  })

  it('should log the correct values for GraphQL', async () => {
    process.env['INPUT_GRAPHQL'] = '{ some { mutation } }'
    process.env['INPUT_VARIABLES'] = '{"some": "variables"}'

    await run()

    expect(infoMock.mock.calls).toEqual([
      ['graphql', '{ some { mutation } }'],
      ['variables', '{"some": "variables"}'],
      ['url', 'url'],
      ['method', 'POST'],
      ['headers', '{"some":"input-headers"}'],
      [
        'data',
        '{"query":"{ some { mutation } }","variables":{"some":"variables"}}'
      ],
      ['fail_fast', 'false'],
      ['response status', 200],
      ['response headers', '{"some":"response-headers"}'],
      ['response body', '{"some":"JSON"}']
    ])

    expect(outputMock.mock.calls).toEqual([
      ['status', '200'],
      ['headers', expect.anything()],
      ['response', '{"some":"JSON"}']
    ])

    delete process.env['INPUT_GRAPHQL']
    delete process.env['INPUT_VARIABLES']
  })
})
