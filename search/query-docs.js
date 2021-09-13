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
  // add 5 searchable docs
  const setup = () =>
    $fetch(search.add("m1", { id: "m1", type: "movie", title: 'Caddyshack' }))
      .chain(toJSON)
      .chain(() => $fetch(search.add("m2", { id: "m2", type: "movie", title: "Stripes" })))
      .chain(toJSON)
  // search based on content
  test('POST /search/:index/_query - find movie successfully', () =>
    setup()
      .chain(() => $fetch(search.query('Stripes', { fields: ["title"], filter: { type: 'movie' } })))
      .chain(toJSON)
      //.map(log)
      .map(doAssert('ok'))
      .toPromise()
  )
}
