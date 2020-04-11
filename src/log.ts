import {info, error} from '@actions/core'

/**
 * Thin wrapper around the stdlib logger.
 * It limits the available logging levels to 'info' and 'error'.
 * It will only log to 'info' if verbose is set to true.
 */
export class Logger {
  verbose: boolean
  constructor(verbose = false) {
    this.verbose = verbose
  }
  info(key: string, value: string | number): void {
    if (!this.verbose) return
    info(`${key}: ${value}`)
  }
  error(key: string, value: string | number): void {
    error(`${key}: ${value}`)
  }
}
