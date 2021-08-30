import { $fetch, toJSON } from "../lib/utils.js";
import { assert, assertEquals } from "asserts";
import crocks from "crocks";

const { Async } = crocks;

const test = Deno.test;

export default function (url, headers) {
  const setup = () =>
    $fetch(`${url}/data/test`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: '42', type: 'test' })
    }).chain(toJSON)

  const tearDown = () =>
    $fetch(`${url}/data/test/42`, {
      method: 'DELETE',
      headers
    }).chain(toJSON)

  const retrieve = (id) => () =>
    $fetch(`${url}/data/test/${id}`, { headers }).chain(toJSON)

  test("GET /data/:store/:id - get document that does not exist", () =>
    $fetch(`${url}/data/test/99`, { headers })
      .chain(toJSON)
      .map((result) => (assertEquals(result.status, 404), result))
      .toPromise());

  test("GET /data/:store/:id - get database not found", () =>
    $fetch(`${url}/data/none/99`, { headers })
      .chain(toJSON)
      .map((result) => (assertEquals(result.status, 400), result))
      .toPromise());

  test('GET /data/:store/:id - success', () =>
    setup()
      .chain(retrieve('42'))
      .map(result => (assertEquals(result.id, '42'), result))
      .chain(tearDown)
      .toPromise()
  )
}
