import * as core from '@actions/core'

export async function run(): Promise<void> {
  try {
    core.setOutput('result', 'dummy output')

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
