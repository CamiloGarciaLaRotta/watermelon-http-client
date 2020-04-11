import {Logger} from '../src/log'
import * as core from '@actions/core'

describe('the logging wrapper', () => {
  it('should print info-level statements when verbose is true', () => {
    const infoMock = jest.spyOn(core, 'info')

    const log = new Logger(true)

    log.info('foo', 'bar')
    log.info('num', 42)

    expect(infoMock.mock.calls).toEqual([['foo: bar'], ['num: 42']])
  })

  it('should not print info-level statements by default', () => {
    const infoMock = jest.spyOn(core, 'info')

    const log = new Logger()

    log.info('foo', 'bar')
    log.info('num', 42)

    expect(infoMock).not.toHaveBeenCalled()
  })

  it('should always print error-level statements', () => {
    const errorMock = jest.spyOn(core, 'error')

    const log = new Logger()

    log.error('foo', 'bar')
    log.error('num', 42)

    expect(errorMock.mock.calls).toEqual([['foo: bar'], ['num: 42']])
  })
})
