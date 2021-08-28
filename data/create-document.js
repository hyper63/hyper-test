import { $fetch, toJSON } from '../lib/utils.js'
import { assert, assertEquals } from 'asserts'
import crocks from 'crocks'

const { Async } = crocks

const test = Deno.test

export default function (url, headers) {
  const setup = () => $fetch(`${url}/data/test`, {
    method: 'PUT',
    headers
  }).chain(toJSON)

  const createDocument = (doc) => () => $fetch(`${url}/data/test`, {
    method: 'POST',
    headers,
    body: JSON.stringify(doc)
  }).chain(toJSON)

  const cleanUp = (id) => $fetch(`${url}/data/test/${id}`, {
    method: 'DELETE',
    headers
  }).chain(toJSON)

  test('POST /data/:store successfully', () => {
    return setup()
      .chain(createDocument({ type: 'test' }))
      .map(r => (assert(r.ok), r.id))
      .chain(cleanUp)
      .toPromise()
  })

  test('POST /data/:store with id successfully', () => {
    return setup()
      .chain(createDocument({ id: '1', type: 'test' }))
      .map(r => (assert(r.id === '1'), r.id))
      .chain(cleanUp)
      .toPromise()
  })

  test('POST /data/:store document conflict', () =>
    setup()
      .chain(createDocument({ id: '2', type: 'test' }))
      .chain(createDocument({ id: '2', type: 'test' }))
      .map(r => (assertEquals(r.ok, false), r))
      .toPromise()

  )
}