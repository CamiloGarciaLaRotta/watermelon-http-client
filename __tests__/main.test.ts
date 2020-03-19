import * as core from '@actions/core'
import { run } from '../src/main'

jest.mock('@actions/core')

describe('when running the action', () => {

  const fakeSetOutput = core.setOutput as jest.MockedFunction<typeof core.setOutput >

  it('should output something', async () => {
    await run()
    expect(fakeSetOutput).toBeCalledWith('result', expect.anything())
  })
})
