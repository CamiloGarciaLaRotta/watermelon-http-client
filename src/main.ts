import * as core from '@actions/core'
import axios from 'axios'

export async function run(): Promise<void> {
  try {
    const url: string = core.getInput('url')
    const query: string = core.getInput('query', {required: true})

    core.info(`url: ${url}`)
    core.info(`query:\n${query}`)

    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/todos/1'
    )
    const data = response.data as Object

    core.info(`response status: ${response.status}`)
    core.info(`response body:\n${JSON.stringify(data)}`)

    core.setOutput('status', `${response.status}`)
    core.setOutput('result', `${JSON.stringify(data)}`)
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

run()
