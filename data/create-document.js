import crocks from 'crocks'
import { assert } from 'asserts'

const { Async } = crocks
const test = Deno.test
const asyncFetch = Async.fromPromise(fetch)
const toJSON = res => {
  console.log(res)
  if (!res.ok) { return Async.Rejected({ ok: false, status: res.status }) }
  return Async.fromPromise(res.json.bind(res))()
}


export default function (url, headers) {
  const setup = () => asyncFetch(`${url}/data/test`, {
    method: 'PUT',
    headers
  }).chain(toJSON)

  const createDocument = () => asyncFetch(`${url}/data/test`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      type: 'test'
    })
  }).chain(toJSON)

  const cleanUp = (id) => asyncFetch(`${url}/data/test/${id}`, {
    method: 'DELETE',
    headers
  }).chain(toJSON)

  test('POST /data/:store', async () => {
    return setup()
      .chain(createDocument)
      .map(r => (console.log(r), r))
      .map(r => (assert(r.ok), r.id))
      .chain(cleanUp)
      .toPromise()
  })
}