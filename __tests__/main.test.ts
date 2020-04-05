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

  it('should print as info level message the inputs and outputs', async () => {
    process.env['INPUT_METHOD'] = 'POST'
    process.env['INPUT_DATA'] = '{ a: "payload" }'
    process.env['INPUT_HEADERS'] = '{"some": "input-headers"}'

    const infoMock = jest.spyOn(core, 'info')

    await run()

    expect(infoMock.mock.calls).toEqual([
      ['url: url'],
      ['method: POST'],
      ['headers: {"some":"input-headers"}'],
      ['data: { a: "payload" }'],
      ['response status: 200'],
      ['response headers: {"some":"response-headers"}'],
      ['response body:\n{"some":"JSON"}']
    ])

    delete process.env['INPUT_METHOD']
    delete process.env['INPUT_DATA']
    delete process.env['INPUT_HEADERS']
  })

  it('should not blow with GET', async () => {
    process.env['INPUT_METHOD'] = 'GET'
    process.env['INPUT_HEADERS'] = '{"some": "input-headers" }'

    const fakeSetOutput = jest.spyOn(core, 'setOutput')

    await run()

    expect(fakeSetOutput).toBeCalledWith('status', '200')
    expect(fakeSetOutput).toBeCalledWith('headers', expect.anything())
    expect(fakeSetOutput).toBeCalledWith('response', '{"some":"JSON"}')

    delete process.env['INPUT_METHOD']
    delete process.env['INPUT_HEADERS']
  })
})
