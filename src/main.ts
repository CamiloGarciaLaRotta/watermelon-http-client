import * as core from '@actions/core'

export async function run(): Promise<void> {
  try {
    const url: string = core.getInput('url')
    const query: string = core.getInput('query', {required: true})

    validateQuery(query)

    core.info(`url:\n${url}`)
    core.info(`query:\n${query}`)

    core.setOutput('result', 'dummy output')
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

function validateQuery(query: string): void {
  if (!query || query.trim().length === 0) {
    throw new Error('"query" is a required parameter')
  }
}

run()
