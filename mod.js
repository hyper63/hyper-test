import Ask from 'https://deno.land/x/ask@1.0.6/mod.ts'
import { create } from 'https://deno.land/x/djwt@v2.3/mod.ts'
import { assert } from 'https://deno.land/std@0.106.0/testing/asserts.ts'

const test = Deno.test
const ask = new Ask()

const answers = await ask.prompt([
  {
    name: 'hyper',
    type: 'input',
    message: 'hyper:'
  }
])

console.log(answers)

const hyper = new URL(answers.hyper)

const key = await window.crypto.subtle.generateKey(
  {
    name: 'HMAC',
    hash: { name: 'SHA-256' }
  },
  false,
  ['sign', 'verify']
)
console.log(hyper)

const jwt = await create({ alg: 'HS256', typ: 'JWT' }, { sub: hyper.username }, key)

test('GET / - get root', async () => {
  const res = await fetch(`https://${hyper.host}`, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  }).then(r => r.json())

  assertEquals(res.name, 'hyper63')
})
