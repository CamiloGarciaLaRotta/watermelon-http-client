👋🏽 Thanks for helping us improve this Action! All feedback, PRs and questions are welcome :heart:

# Links
- [Project Board](https://github.com/CamiloGarciaLaRotta/watermelon-http-client/projects/1): If you're looking for Good-first-issues, PR reviews, etc.
- [`.github/workflows`](https://github.com/CamiloGarciaLaRotta/watermelon-http-client/tree/main/.github/workflows): if you are looking for examples of how to use the Action

# Setting up your local environment
Just clone the repo and install the dependencies
```bash
git clone https://github.com/CamiloGarciaLaRotta/watermelon-http-client.git
cd watermelon-http-client
npm install
```

Any editor will work fine. For ease of use, we have commited the `.vscode` tasks that facilitate testing by attaching the debugger automatically.

```bash
cmd + shift + B: build and test
cmd + shift + T: test
F5: start and attach debugger
```

### Debugging
 In order to debug an issue, the easiest approach is to write a test case which call `run()`. Then add a breakpoint and start traversing the code.

### Testing
Inputs are automatically transformed by the GitHub Actions runtime into ENV vars. For example, the input `data`, will be available at runtime as `$INPUT_DATA`.
In tests however, we have to manually generate this ENV vars to mock the expected defaults. You can do so by setting it before and deleting it after executing the action.

```typescript
    process.env['INPUT_METHOD'] = 'post'
    
    await run()

    delete process.env['INPUT_URL']
```

We have 3 levels of tests:
- unit tests: [`__tests__/<file-name>.ts`]()  
  We mock the network calls, as we only care about each exported function's behaviour.
- integration tests: [`__tests__/integration.test.ts`]()  
  We don't mock the network calls, as we want to make sure the complete action works as expected.
- end-to-end tests: [`.github/workflows`]()  
  We don't set up any fixtures. Instead, they use the action as any other person would: inside a workflow.

# Pull Requests
Simply: branch, commit, open a PR
- If it's a bug fix, ensure there's a tracking issue
- always commit the compiled `dist/index.js`. `actions.yml` states that this file will be called when the action is used. You might find it useful to setup a pre-commit hook with the following line: `yarn all`
- regardless of the change, add tests. The more the merrier!

# Security Bugs
If you find any security issues, please reach out to us via email: `camilo.garcia.larotta` gmail
