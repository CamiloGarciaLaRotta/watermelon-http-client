import * as core from '@actions/core'
import {run} from '../src/main'
import axios from 'axios'
import {when} from 'jest-when'

jest.mock('axios')

describe('when running the action with valid inputs', () => {
  const fakeGet = axios.get as jest.MockedFunction<typeof axios.get>

  beforeEach(() => {
    when(fakeGet)
      .calledWith(expect.anything())
      .mockReturnValue(Promise.resolve({status: 200, data: {some: 'JSON'}}))

    jest.resetModules()
    process.env['INPUT_URL'] = 'https://foo_bar.com/api'
    process.env['INPUT_QUERY'] = `a
      multiline
      query`
  })

  afterEach(() => {
    delete process.env['INPUT_URL']
    delete process.env['INPUT_QUERY']
  })

  it('should print as info level message the query and url', async () => {
    const infoMock = jest.spyOn(core, 'info')

    await run()

    expect(infoMock.mock.calls).toEqual([
      ['url: https://foo_bar.com/api'],
      [
        `query:\na
      multiline
      query`
      ],
      ['response status: 200'],
      [
        `response body:
{"some":"JSON"}`
      ]
    ])
  })

  it('should output something if a query was supplied', async () => {
    const fakeSetOutput = jest.spyOn(core, 'setOutput')

    await run()

    expect(fakeSetOutput).toBeCalledWith('status', expect.anything())
    expect(fakeSetOutput).toBeCalledWith('result', expect.anything())
  })
})

describe('when running the action with invalid inputs', () => {
  it('should fail if no query is specified', async () => {
    const fakeSetFailed = jest.spyOn(core, 'setFailed')
    const fakeSetOutput = jest.spyOn(core, 'setOutput')

    await run()
    expect(fakeSetFailed).toBeCalledWith(
      'Input required and not supplied: query'
    )
    expect(fakeSetOutput).not.toBeCalled()
  })
})
