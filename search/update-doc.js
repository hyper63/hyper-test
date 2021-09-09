import { $, $fetch, toJSON } from "../lib/utils.js";
import { assert, assertEquals } from "asserts";

const test = Deno.test
const doAssert = (prop) => (obj) => {
  assert(obj[prop])
  return obj
}

const doEquals = (prop, value) => (obj) => {
  assertEquals(obj[prop], value)
  return obj
}

const doError = code => res => {
  assert(!res.ok)
  assertEquals(res.status, 404)
  return res
}

const log = _ => (console.log(_), _)

export default function (search) {
  const setup = () => $fetch(search.add('movie-3', { id: 'movie-3', type: 'movie', title: 'Hulk' }))
    .chain(toJSON)

  const cleanUp = key => () => $fetch(search.remove('movie-3')).chain(toJSON)

  test('PUT /search/:store/:key - update search document successfully', () =>
    setup()
      .chain(() => $fetch(search.update('movie-3', { id: 'movie-3', type: 'movie', title: 'Avengers' })))
      .chain(toJSON)
      .map(doAssert('ok'))
      .chain(cleanUp('movie-3'))
      .toPromise()

  )
}
