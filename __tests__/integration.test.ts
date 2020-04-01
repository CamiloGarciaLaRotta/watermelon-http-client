import axios from 'axios'
import * as core from '@actions/core'
import {run} from '../src/main'
import {when} from 'jest-when'

jest.setTimeout(600000)

describe('when called with a GET query', () => {
  beforeEach(() => {
    process.env['INPUT_URL'] = 'https://jsonplaceholder.typicode.com/todos?id=1'
    process.env['INPUT_METHOD'] = 'get'
  })

  afterEach(() => {
    delete process.env['INPUT_URL']
    delete process.env['INPUT_METHOD']
  })

  it('should output a valid result', async () => {
    const fakeSetOutput = jest.spyOn(core, 'setOutput')

    await run()

    expect(fakeSetOutput).toBeCalledWith('status', expect.anything())
    expect(fakeSetOutput).toBeCalledWith('response', expect.anything())
  })
})

describe('when called with a POST request', () => {
  beforeEach(() => {
    process.env['INPUT_URL'] = 'https://jsonplaceholder.typicode.com/todos?id=1'
    process.env['INPUT_METHOD'] = 'post'
    process.env['INPUT_DATA'] =
      '{ "title": "dummy-todo", "userId": 1, "completed": false }'
  })

  afterEach(() => {
    delete process.env['INPUT_URL']
    delete process.env['INPUT_METHOD']
    delete process.env['INPUT_DATA']
  })

  it('should output a valid result', async () => {
    const fakeSetOutput = jest.spyOn(core, 'setOutput')

    await run()

    expect(fakeSetOutput).toBeCalledWith('status', expect.anything())
    expect(fakeSetOutput).toBeCalledWith('response', expect.anything())
  })
})

describe('when called with a GraphQL query', () => {
  beforeEach(() => {
    process.env['INPUT_URL'] = 'https://countries.trevorblades.com/'
    process.env['INPUT_GRAPHQL'] = `
      {
        country(code: "CO") {
          name
          emoji
         }
      }`
  })

  afterEach(() => {
    delete process.env['INPUT_URL']
    delete process.env['INPUT_GRAPHQL']
  })

  it('should output something if a query was supplied', async () => {
    const fakeSetOutput = jest.spyOn(core, 'setOutput')

    await run()

    expect(fakeSetOutput).toBeCalledWith('status', expect.anything())
    expect(fakeSetOutput).toBeCalledWith('response', expect.anything())
  })
})

describe('when action fails', () => {
  it('should handle missing input gracefully', async () => {
    const fakeSetOutput = jest.spyOn(core, 'setOutput')

    await run()

    expect(fakeSetOutput).not.toHaveBeenCalled()
  })

  it('should handle invalid input errors gracefully ', async () => {
    process.env['INPUT_URL'] = 'https://jsonplaceholder.typicode.com/todos?id=1'
    process.env['INPUT_METHOD'] = 'invalid-http-method'

    const fakeLogError = jest.spyOn(core, 'error')
    const fakeSetOutput = jest.spyOn(core, 'setOutput')

    // does not throw exception
    await run()

    // once for each of the following: status, headers, response and final error message
    expect(fakeLogError).toHaveBeenCalledTimes(4)
    expect(fakeSetOutput).not.toHaveBeenCalled()

    delete process.env['INPUT_URL']
    delete process.env['INPUT_METHOD']
  })

  it('should handle server-side errors gracefully ', async () => {
    // request will 404 because server does not respond to POST
    process.env['INPUT_URL'] = 'https://camilogarcialarotta.io/'
    process.env['INPUT_METHOD'] = 'post'

    const fakeLogError = jest.spyOn(core, 'error')
    const fakeSetOutput = jest.spyOn(core, 'setOutput')

    // does not throw exception
    await run()

    // once for each of the following: status, headers, response and final error message
    expect(fakeLogError).toHaveBeenCalledTimes(4)
    expect(fakeSetOutput).not.toHaveBeenCalled()

    delete process.env['INPUT_URL']
    delete process.env['INPUT_METHOD']
  })

  it('should handle action-side errors gracefully ', async () => {
    // request won't be generated because it's an invalid protocol
    process.env['INPUT_URL'] = 'ftp://>invalid|url<'

    const fakeLogError = jest.spyOn(core, 'error')
    const fakeSetOutput = jest.spyOn(core, 'setOutput')

    // does not throw exception
    await run()

    // once for each of the following: status, headers, response and final error message
    expect(fakeLogError).toHaveBeenCalledTimes(4)
    expect(fakeSetOutput).not.toHaveBeenCalled()
  })
})