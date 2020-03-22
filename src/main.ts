import * as core from '@actions/core'
import {request, Method} from './http'

export async function run(): Promise<void> {
  try {
    const url: string = core.getInput('url', {required: true})
    let method: string = core.getInput('method', {required: true})
    let data: string = core.getInput('data')
    const graphql: string = core.getInput('graphql')

    if (graphql.length !== 0) {
      method = 'POST'
      data = JSON.stringify({query: graphql})
      core.info(`graphql:\n${graphql}`)
    }

    core.info(`url: ${url}`)
    core.info(`method: ${method}`)
    if (data.length !== 0) {
      core.info(`data: ${data}`)
    }

    const [status, rawResponse] = await request(url, <Method>method, data)

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
