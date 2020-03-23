# 🍉 Watermelon HTTP client - GitHub Action 

A Typescript Action that performs HTTP requests within your workflow. It supports GraphQL queries!

![Build](https://github.com/CamiloGarciaLaRotta/watermelon-http-client/workflows/Build/badge.svg?branch=master)

### Inputs

|Argument|  Description  |  Default  |
| --- | --- | --- |
| url | Endpoint to query | https://api.github.com/graphql |
| method | HTTP method | `GET` |
| data | HTTP request payload |  |
| graphql | GraphQL query to execute. If defined, the `data` field is automatically populated with this payload and the `method` is set to `POST` |


### Outputs
| Name | Description |
| --- | --- |
| `status` | Numeric response status code | 
| `response` | JSON encoded response |

### Examples




- [`GraphQL`](.github/workflows/graphql.yml)
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
  
- [`GET`](.github/workflows/get.yml)
  ```yaml
  uses: CamiloGarciaLaRotta/watermelon-http-client@v1
  with:
    url: 'https://jsonplaceholder.typicode.com/todos?id=1'
  ```
  
- [`POST`](.github/workflows/post.yml)
  ```yaml
  uses: CamiloGarciaLaRotta/watermelon-http-client@v1
  with:
    url: 'https://jsonplaceholder.typicode.com/todos'
    method: post
    data: '{ "title": "dummy-todo", "userId": 1, "completed": false }'
  ```
