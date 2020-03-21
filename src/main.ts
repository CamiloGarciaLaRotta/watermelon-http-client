import * as core from '@actions/core'
import {post} from './http'

export async function run(): Promise<void> {
  try {
    const url: string = core.getInput('url')
    const method: string = core.getInput('method')
    const query: string = core.getInput('query', {required: true})

    core.info(`url: ${url}`)
    core.info(`method: ${method}`)
    core.info(`query:\n${query}`)

    const [status, rawResponse] = await post(url, query)

    const response = JSON.stringify(rawResponse)

    core.info(`response status: ${status}`)
    core.info(`response body:\n${response}`)

    core.setOutput('status', `${status}`)
    core.setOutput('response', `${response}`)
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

run()
