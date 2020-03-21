import * as core from '@actions/core'
import {run} from '../src/main'
import axios from 'axios'
import {when} from 'jest-when'

jest.mock('axios')

describe('when running the action with valid inputs', () => {
  const fakePost = axios.post as jest.MockedFunction<typeof axios.post>

  beforeEach(() => {
    when(fakePost)
      .calledWith('https://foo_bar.com/api', '{ a: "payload" }')
      .mockReturnValue(Promise.resolve({status: 200, data: {some: 'JSON'}}))

    jest.resetModules()
    process.env['INPUT_URL'] = 'https://foo_bar.com/api'
    process.env['INPUT_METHOD'] = 'post'
    process.env['INPUT_QUERY'] = '{ a: "payload" }'
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
      ['method: post'],
      ['query:\n{ a: "payload" }'],
      ['response status: 200'],
      ['response body:\n{"some":"JSON"}']
    ])
  })

  it('should output something if a query was supplied', async () => {
    const fakeSetOutput = jest.spyOn(core, 'setOutput')

    await run()

    expect(fakeSetOutput).toBeCalledWith('status', '200')
    expect(fakeSetOutput).toBeCalledWith('response', '{"some":"JSON"}')
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
