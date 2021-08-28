import Ask from 'ask'
import { assertEquals } from 'asserts'
import jwt from './lib/jwt.js'

const test = Deno.test
const ask = new Ask()

console.log('hyper test suite ⚡️')
const answers = await ask.prompt([
  {
    name: 'hyper',
    type: 'input',
    message: 'hyper (http://localhost:6363):'
  }
])

const hyper = new URL(answers.hyper === '' ? 'http://localhost:6363' : answers.hyper)

let headers = {
  'Content-Type': 'application/json'
}

if (hyper.username !== '') {
  const token = jwt(hyper.username, hyper.password)
  console.log(token)
  headers = { ...headers, Authorization: `Bearer ${token}` }
}

const url = `${hyper.protocol === 'hyperio:' ? 'https:' : 'http:'}//${hyper.host}`

test('GET / - get root', async () => {
  const res = await fetch(url, {
    headers
  }).then(r => r.json())
  assertEquals(res.name, 'hyper63')
})

const runTest = x => x.default(url, headers)

await import('./data/get-index.js').then(runTest)
await import('./data/put-data-test.js').then(runTest)
await import('./data/create-document.js').then(runTest)