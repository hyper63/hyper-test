import { assert } from 'asserts'
const test = Deno.test

export default async function (url, headers) {
  test('PUT /data/test', async () => {
    const res = await fetch(`${url}/data/test`, {
      method: 'PUT',
      headers
    }).then(r => r.json())
    assert(res.ok)
  })
}