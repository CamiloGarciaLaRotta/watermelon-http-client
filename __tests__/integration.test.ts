import * as core from '@actions/core'
import {Logger} from '../src/log'
import {run} from '../src/main'
import 'jest-os-detection'

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
    const outputMock = jest.spyOn(core, 'setOutput')
    const errorMock = jest.spyOn(Logger.prototype, 'error')

    await run()

    expect(outputMock.mock.calls).toEqual([
      ['status', expect.anything()],
      ['headers', expect.anything()],
      ['response', expect.anything()]
    ])

    expect(errorMock).not.toHaveBeenCalled()
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
    process.env['INPUT_URL'] = 'https://api.github.com'
    const outputMock = jest.spyOn(core, 'setOutput')
    const errorMock = jest.spyOn(Logger.prototype, 'error')

    await run()

    expect(errorMock.mock.calls).toEqual([
      ['response status', expect.anything()],
      ['response headers', expect.anything()],
      ['response body', expect.anything()]
    ])

    expect(outputMock.mock.calls).toEqual([
      ['status', expect.anything()],
      ['headers', expect.anything()],
      ['response', expect.anything()]
    ])
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
    process.env['INPUT_HEADERS'] = '{"content-type":"application/json"}'
    process.env['INPUT_VARIABLES'] = '{}'
  })

  afterEach(() => {
    delete process.env['INPUT_URL']
    delete process.env['INPUT_GRAPHQL']
    delete process.env['INPUT_HEADERS']
    delete process.env['INPUT_VARIABLES']
  })

  it('should output something if a query was supplied', async () => {
    const outputMock = jest.spyOn(core, 'setOutput')
    const errorMock = jest.spyOn(Logger.prototype, 'error')

    await run()

    expect(outputMock.mock.calls).toEqual([
      ['status', expect.anything()],
      ['headers', expect.anything()],
      ['response', expect.anything()]
    ])

    expect(errorMock).not.toHaveBeenCalled()
  })
})

describe('when action fails without fail_fast', () => {
  it('should handle missing input gracefully', async () => {
    const outputMock = jest.spyOn(core, 'setOutput')
    const failureMock = jest.spyOn(core, 'setFailed')

    await run()

    expect(outputMock).toHaveBeenCalled()
    expect(failureMock).not.toHaveBeenCalled()
  })

  it('should handle invalid input errors gracefully ', async () => {
    process.env['INPUT_URL'] = 'https://jsonplaceholder.typicode.com/todos?id=1'
    process.env['INPUT_METHOD'] = 'invalid-http-method'

    const errorMock = jest.spyOn(Logger.prototype, 'error')
    const outputMock = jest.spyOn(core, 'setOutput')

    await run()

    // once for each of the following: status, headers, response
    expect(errorMock).toHaveBeenCalledTimes(3)
    expect(outputMock).toHaveBeenCalled()

    delete process.env['INPUT_URL']
    delete process.env['INPUT_METHOD']
  })

  it('should handle server-side errors gracefully ', async () => {
    // request will 404 because server does not respond to POST
    process.env['INPUT_URL'] = 'https://camilogarcialarotta.io/'
    process.env['INPUT_METHOD'] = 'post'

    const errorMock = jest.spyOn(Logger.prototype, 'error')
    const outputMock = jest.spyOn(core, 'setOutput')

    await run()

    // once for each of the following: status, headers, response
    expect(errorMock).toHaveBeenCalledTimes(3)
    expect(outputMock).toHaveBeenCalled()

    delete process.env['INPUT_URL']
    delete process.env['INPUT_METHOD']
  })

  it('should handle action-side errors gracefully ', async () => {
    process.env['INPUT_URL'] = 'abc'

    const fakeLogError = jest.spyOn(core, 'error')
    const outputMock = jest.spyOn(core, 'setOutput')

    await run()

    // once for each of the following: status, headers, response
    expect(fakeLogError).toHaveBeenCalledTimes(3)
    expect(outputMock).toHaveBeenCalled()
  })

  it('should reply with a 401 Unauthorized', async () => {
    process.env['INPUT_URL'] = 'https://api.github.com/graphql'
    process.env['INPUT_METHOD'] = 'post'

    const errorMock = jest.spyOn(Logger.prototype, 'error')
    const outputMock = jest.spyOn(core, 'setOutput')

    await run()

    expect(outputMock).toHaveBeenCalled()
    expect(errorMock).toHaveBeenNthCalledWith(1, 'response status', 401)

    delete process.env['INPUT_URL']
    delete process.env['INPUT_HEADERS']
  })
})

describe('when action fails with fail_fast', () => {
  beforeEach(() => {
    process.env['INPUT_FAIL_FAST'] = 'true'
  })

  it.skipWindows('should handle missing input gracefully', async () => {
    const outputMock = jest.spyOn(core, 'setOutput')
    const failureMock = jest.spyOn(core, 'setFailed')

    await run()

    expect(outputMock).not.toHaveBeenCalled()
    expect(failureMock).toHaveBeenCalled()
  })

  it('should handle invalid input errors gracefully ', async () => {
    process.env['INPUT_URL'] = 'https://jsonplaceholder.typicode.com/todos?id=1'
    process.env['INPUT_METHOD'] = 'invalid-http-method'

    const errorMock = jest.spyOn(Logger.prototype, 'error')
    const outputMock = jest.spyOn(core, 'setOutput')

    await run()

    // once for each of the following: status, headers, response
    expect(errorMock).toHaveBeenCalledTimes(3)
    expect(outputMock).not.toHaveBeenCalled()

    delete process.env['INPUT_URL']
    delete process.env['INPUT_METHOD']
  })

  it('should handle server-side errors gracefully ', async () => {
    // request will 404 because server does not respond to POST
    process.env['INPUT_URL'] = 'https://camilogarcialarotta.io/'
    process.env['INPUT_METHOD'] = 'post'

    const errorMock = jest.spyOn(Logger.prototype, 'error')
    const outputMock = jest.spyOn(core, 'setOutput')

    await run()

    // once for each of the following: status, headers, response
    expect(errorMock).toHaveBeenCalledTimes(3)
    expect(outputMock).not.toHaveBeenCalled()

    delete process.env['INPUT_URL']
    delete process.env['INPUT_METHOD']
  })

  it('should handle action-side errors gracefully ', async () => {
    process.env['INPUT_URL'] = 'abc'

    const fakeLogError = jest.spyOn(core, 'error')
    const outputMock = jest.spyOn(core, 'setOutput')

    await run()

    // once for each of the following: status, headers, response
    expect(fakeLogError).toHaveBeenCalledTimes(3)
    expect(outputMock).not.toHaveBeenCalled()
  })

  it('should reply with a 401 Unauthorized', async () => {
    process.env['INPUT_URL'] = 'https://api.github.com/graphql'
    process.env['INPUT_METHOD'] = 'post'

    const errorMock = jest.spyOn(Logger.prototype, 'error')
    const outputMock = jest.spyOn(core, 'setOutput')

    await run()

    expect(outputMock).not.toHaveBeenCalled()
    expect(errorMock).toHaveBeenNthCalledWith(1, 'response status', 401)

    delete process.env['INPUT_URL']
    delete process.env['INPUT_HEADERS']
  })
})
