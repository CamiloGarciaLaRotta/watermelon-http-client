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
      .calledWith('url', 'GET', '')
      .mockReturnValue(Promise.resolve([200, {some: 'JSON'}]))

    when(fakeRequest)
      .calledWith('url', 'POST', '{ a: "payload" }')
      .mockReturnValue(Promise.resolve([200, {some: 'JSON'}]))

    process.env['INPUT_URL'] = 'url'
  })

  afterEach(() => {
    delete process.env['INPUT_URL']
  })

  it('should print as info level message the inputs and outputs', async () => {
    process.env['INPUT_METHOD'] = 'POST'
    process.env['INPUT_DATA'] = '{ a: "payload" }'

    const infoMock = jest.spyOn(core, 'info')

    await run()

    expect(infoMock.mock.calls).toEqual([
      ['url: url'],
      ['method: POST'],
      ['data: { a: "payload" }'],
      ['response status: 200'],
      ['response body:\n{"some":"JSON"}']
    ])

    delete process.env['INPUT_METHOD']
    delete process.env['INPUT_DATA']
  })

  it('should not blow with GET', async () => {
    process.env['INPUT_METHOD'] = 'GET'

    const fakeSetOutput = jest.spyOn(core, 'setOutput')

    await run()

    expect(fakeSetOutput).toBeCalledWith('status', '200')
    expect(fakeSetOutput).toBeCalledWith('response', '{"some":"JSON"}')

    delete process.env['INPUT_METHOD']
  })
})
