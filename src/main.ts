import * as core from '@actions/core'
import {Method} from 'axios'
import {request} from './http'
import {graphqlPayloadFor} from './graphql'

export async function run(): Promise<void> {
  try {
    const url: string = core.getInput('url')
    let method: string = core.getInput('method')
    let data: string = core.getInput('data')
    const graphql: string = core.getInput('graphql')
    const rawInputHeaders: string = core.getInput('headers')

    let inputHeaders: Object
    if (rawInputHeaders.length > 0) {
      inputHeaders = JSON.parse(rawInputHeaders)
    } else {
      inputHeaders = {}
    }

    if (graphql.length !== 0) {
      method = 'POST'
      data = graphqlPayloadFor(graphql)

      if (isEmpty(inputHeaders)) {
        inputHeaders = {'Content-Type': 'application/graphql'}
      }

      core.info(`graphql:\n${graphql}`)
    }

    core.info(`url: ${url}`)
    core.info(`method: ${method}`)
    core.info(`headers: ${JSON.stringify(inputHeaders)}`)
    if (data.length !== 0) {
      core.info(`data: ${data}`)
    }

    const [status, rawResponseHeaders, rawResponse] = await request(
      url,
      <Method>method,
      data,
      inputHeaders
    )

    const responseHeaders = JSON.stringify(rawResponseHeaders)
    const response = JSON.stringify(rawResponse)

    if (status < 200 || status >= 300) {
      core.error(`response status: ${status}`)
      core.error(`response headers: ${responseHeaders}`)
      core.error(`response body:\n${response}`)

      throw new Error(`request failed: ${response}`)
    }

    core.info(`response status: ${status}`)
    core.info(`response headers: ${responseHeaders}`)
    core.info(`response body:\n${response}`)

    core.setOutput('status', `${status}`)
    core.setOutput('headers', `${responseHeaders}`)
    core.setOutput('response', `${response}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

const isEmpty = (o: Object): Boolean => Object.keys(o).length === 0

run()
