import * as core from '@actions/core'
import {run} from '../src/main'
import {request} from '../src/http'
import {when} from 'jest-when'
import {Logger} from '../src/log'

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
    process.env['INPUT_VERBOSE'] = 'true'
    process.env['INPUT_METHOD'] = 'GET'
    process.env['INPUT_GRAPHQL'] = '{ some { mutation } }'
    process.env['INPUT_VARIABLES'] = '{"some": "variables"}'
    process.env['INPUT_HEADERS'] = '{"some": "input-headers"}'

    const outputMock = jest.spyOn(core, 'setOutput')
    const infoMock = (Logger.prototype.info = jest.fn())

    await run()

    expect(infoMock).toHaveBeenNthCalledWith(
      1,
      'graphql',
      '{ some { mutation } }'
    )
    expect(infoMock).toHaveBeenNthCalledWith(
      2,
      'variables',
      '{"some": "variables"}'
    )
    expect(infoMock).toHaveBeenNthCalledWith(3, 'url', 'url')
    expect(infoMock).toHaveBeenNthCalledWith(4, 'method', 'POST')
    expect(infoMock).toHaveBeenNthCalledWith(
      5,
      'headers',
      '{"some":"input-headers"}'
    )
    expect(infoMock).toHaveBeenNthCalledWith(
      6,
      'data',
      '{"query":"{ some { mutation } }","variables":{"some":"variables"}}'
    )
    expect(infoMock).toHaveBeenNthCalledWith(7, 'response status', 200)
    expect(infoMock).toHaveBeenNthCalledWith(
      8,
      'response headers',
      '{"some":"response-headers"}'
    )
    expect(infoMock).toHaveBeenNthCalledWith(
      9,
      'response body',
      '{"some":"JSON"}'
    )

    expect(outputMock).toHaveBeenNthCalledWith(1, 'status', '200')
    expect(outputMock).toHaveBeenNthCalledWith(2, 'headers', expect.anything())
    expect(outputMock).toHaveBeenNthCalledWith(3, 'response', '{"some":"JSON"}')

    delete process.env['INPUT_VERBOSE']
    delete process.env['INPUT_METHOD']
    delete process.env['INPUT_GRAPHQL']
    delete process.env['INPUT_VARIABLES']
    delete process.env['INPUT_HEADERS']
  })

  it('should log the correct values for GET', async () => {
    process.env['INPUT_VERBOSE'] = 'true'
    process.env['INPUT_METHOD'] = 'GET'
    process.env['INPUT_HEADERS'] = '{"some": "input-headers" }'

    const fakeSetOutput = jest.spyOn(core, 'setOutput')
    const infoMock = (Logger.prototype.info = jest.fn())

    await run()

    expect(infoMock).toHaveBeenNthCalledWith(1, 'url', 'url')
    expect(infoMock).toHaveBeenNthCalledWith(2, 'method', 'GET')
    expect(infoMock).toHaveBeenNthCalledWith(
      3,
      'headers',
      '{"some":"input-headers"}'
    )
    expect(infoMock).toHaveBeenNthCalledWith(4, 'response status', 200)
    expect(infoMock).toHaveBeenNthCalledWith(
      5,
      'response headers',
      '{"some":"response-headers"}'
    )
    expect(infoMock).toHaveBeenNthCalledWith(
      6,
      'response body',
      '{"some":"JSON"}'
    )

    expect(fakeSetOutput).toHaveBeenNthCalledWith(1, 'status', '200')
    expect(fakeSetOutput).toHaveBeenNthCalledWith(
      2,
      'headers',
      expect.anything()
    )
    expect(fakeSetOutput).toHaveBeenNthCalledWith(
      3,
      'response',
      '{"some":"JSON"}'
    )

    delete process.env['INPUT_VERBOSE']
    delete process.env['INPUT_METHOD']
    delete process.env['INPUT_HEADERS']
  })

  it('should log the correct values for POST', async () => {
    process.env['INPUT_VERBOSE'] = 'true'
    process.env['INPUT_METHOD'] = 'POST'
    process.env['INPUT_HEADERS'] = '{"some": "input-headers"}'
    process.env['INPUT_DATA'] = '{"some": "data"}'

    const outputMock = jest.spyOn(core, 'setOutput')
    const infoMock = (Logger.prototype.info = jest.fn())

    await run()

    expect(infoMock).toHaveBeenNthCalledWith(1, 'url', 'url')
    expect(infoMock).toHaveBeenNthCalledWith(2, 'method', 'POST')
    expect(infoMock).toHaveBeenNthCalledWith(
      3,
      'headers',
      '{"some":"input-headers"}'
    )
    expect(infoMock).toHaveBeenNthCalledWith(4, 'data', '{"some": "data"}')
    expect(infoMock).toHaveBeenNthCalledWith(5, 'response status', 200)
    expect(infoMock).toHaveBeenNthCalledWith(
      6,
      'response headers',
      '{"some":"response-headers"}'
    )
    expect(infoMock).toHaveBeenNthCalledWith(
      7,
      'response body',
      '{"some":"JSON"}'
    )

    expect(outputMock).toHaveBeenNthCalledWith(1, 'status', '200')
    expect(outputMock).toHaveBeenNthCalledWith(2, 'headers', expect.anything())
    expect(outputMock).toHaveBeenNthCalledWith(3, 'response', '{"some":"JSON"}')

    delete process.env['INPUT_VERBOSE']
    delete process.env['INPUT_METHOD']
    delete process.env['INPUT_HEADERS']
    delete process.env['INPUT_DATA']
  })
})
