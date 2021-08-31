import { $fetch, toJSON } from "../lib/utils.js";
import { assertEquals } from "asserts";

const test = Deno.test;

export default function (url, headers) {
  const setup = () =>
    $fetch(`${url}/data/test`, { method: "PUT", headers }).chain(toJSON);

  const update = ({ db, doc }) =>
    () =>
      $fetch(`${url}/data/${db}/${doc.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(doc),
      }).chain(toJSON);

  const create = (doc) =>
    () =>
      $fetch(`${url}/data/test`, {
        method: "POST",
        headers,
        body: JSON.stringify(doc),
      }).chain(toJSON);

  const remove = (id) =>
    () =>
      $fetch(`${url}/data/test/${id}`, {
        method: "DELETE",
        headers,
      }).chain(toJSON);

  /*
  test('PUT /data/:store/:id - update document should fail if doc does not exist', () =>
    setup()
      .chain(update({ db: 'test', doc: { id: '24', type: 'test' } }))
      .map(result => (assertEquals(result.ok, false), result))
      .map(result => (assertEquals(result.status, 404), result))
      .toPromise()
  )
  */

  test("PUT /data/:store/:id - update document should fail if db does not exist", () =>
    setup()
      .chain(update({ db: "none", doc: { id: "33", type: "test" } }))
      .map((result) => (assertEquals(result.status, 400), result))
      .toPromise());

  test("PUT /data/:store/:id - update document should be successful", () =>
    setup()
      .chain(create({ id: "63", type: "test" }))
      .chain(
        update({ db: "test", doc: { id: "63", type: "test", name: "foo" } }),
      )
      .map((result) => (assertEquals(result.ok, true), result))
      .chain(remove("63")) // cleanup
      .toPromise());
}
