# 🍉 Watermelon HTTP client - GitHub Action 

A Typescript Action that performs HTTP requests within your workflow. It supports GraphQL!

[![Build](https://github.com/CamiloGarciaLaRotta/watermelon-http-client/workflows/Build/badge.svg?branch=master)](https://github.com/CamiloGarciaLaRotta/watermelon-http-client/actions)

## Inputs

| Argument | Description | Default |
| --- | --- | --- |
| url | Endpoint to query | https://api.github.com/graphql |
| method | HTTP method | `GET` |
| headers | JSON encoded HTTP headers | Empty by default. If no headers are supplied, GraphQL queries will be sent with `{'Content-Type': 'application/json'}` |
| data | JSON encoded HTTP request payload |  |
| graphql | GraphQL query/mutation to execute | Empty by default. If defined, the `data` field is automatically populated with this payload and the `method` is set to `POST` |
| variables | JSON encoded variables for the GraphQL mutation | |
| operation_name | name of the entrypoint GraphQL operation if multiple are defined in `graphql` | |
| verbose | wether to print info-level statements or not | false |

## Outputs

| Name | Description |
| --- | --- |
| `status` | Numeric response status code | 
| `headers` | JSON encoded response HTTP headers |
| `response` | JSON encoded response |

## Examples
Complete workflow file examples for the majority of supported HTTP requests can be found in [`.github/workflows`](.github/workflows).
  
### GET
 [workflow file](.github/workflows/get.yml) - [sample output](https://github.com/CamiloGarciaLaRotta/watermelon-http-client/runs/576774093?check_suite_focus=true)
```yaml
uses: CamiloGarciaLaRotta/watermelon-http-client@v1
with:
  url: 'https://jsonplaceholder.typicode.com/todos?id=1'
```
  
### POST
 [workflow file](.github/workflows/post.yml) - [sample output](https://github.com/CamiloGarciaLaRotta/watermelon-http-client/runs/576774264?check_suite_focus=true)
```yaml
uses: CamiloGarciaLaRotta/watermelon-http-client@v1
with:
  url: 'https://jsonplaceholder.typicode.com/todos'
  method: post
  data: '{ "title": "dummy-todo", "userId": 1, "completed": false }'
```

### GraphQL Query
 [workflow file](.github/workflows/graphql_query_1.yml) - [sample output](https://github.com/CamiloGarciaLaRotta/watermelon-http-client/runs/576774194?check_suite_focus=true)
```yaml
uses: CamiloGarciaLaRotta/watermelon-http-client@v1
with:
url: 'https://countries.trevorblades.com/'
  graphql: |
    {
      country(code: "CO") {
        name
        emoji
      }
    }
```

### GraphQL Mutation
 [workflow file](.github/workflows/graphql_mutation.yml) - [sample output](https://github.com/CamiloGarciaLaRotta/watermelon-http-client/runs/576774123?check_suite_focus=true)
```yaml
uses: CamiloGarciaLaRotta/watermelon-http-client@v1
with:
  headers: '{"Authorization": "bearer ${{ secrets.TOKEN }}" }'
  graphql: |
    mutation addRocketEmoji($reaction:AddReactionInput!) {
      addReaction(input:$reaction) {
        reaction {
          content
        }
        subject {
          id
        }
      }
    }
  variables: |
    {
      "reaction": {
        "subjectId":"${{ secrets.ISSUE_ID }}",
        "content":"ROCKET"
      }
    }
```

## Contributing
See the [contribution guidelines](CONTRIBUTING.md) ❤️
