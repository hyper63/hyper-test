import { $fetch, toJSON } from "../lib/utils.js";
import { assert, assertEquals } from "asserts";
import crocks from "crocks";

const { Async } = crocks;

const test = Deno.test;

export default function (url, headers) {
  const setup = () =>
    $fetch(`${url}/data/test`, {
      method: "PUT",
      headers,
    }).chain(toJSON);

  const createDocument = (doc) =>
    () =>
      $fetch(`${url}/data/test`, {
        method: "POST",
        headers,
        body: JSON.stringify(doc),
      }).chain(toJSON);

  const cleanUp = (id) =>
    $fetch(`${url}/data/test/${id}`, {
      method: "DELETE",
      headers,
    }).chain(toJSON);

  const createDocForDb = (db, doc) =>
    $fetch(`${url}/data/${db}`, {
      method: "POST",
      headers,
      body: JSON.stringify(doc),
    }).chain(toJSON);

  const removeDb = (db) =>
    $fetch(`${url}/data/${db}`, { method: "DELETE" })
      .chain(toJSON);

  test("POST /data/:store successfully", () =>
    setup()
      .chain(createDocument({ type: "test" }))
      .map((r) => (assert(r.ok), r.id))
      .chain(cleanUp)
      .toPromise());

  test("POST /data/:store with id successfully", () => {
    return setup()
      .chain(createDocument({ id: "10", type: "test" }))
      .map((r) => (assert(r.id === "10"), r.id))
      .chain(cleanUp)
      .toPromise();
  });

  test("POST /data/:store document conflict", () =>
    setup()
      .chain(createDocument({ id: "2", type: "test" }))
      .chain(createDocument({ id: "2", type: "test" }))
      .map((r) => (assertEquals(r.ok, false), r.id))
      .chain(cleanUp)
      .toPromise());
  // return error if store does not exist
  test("POST /data/:store error if store does not exist", () =>
    createDocForDb("none", { id: "30", type: "test" })
      .map((r) => {
        assertEquals(r.ok, false);
        assertEquals(r.status, 400);
        return r;
      })
      .toPromise());

  test("POST /data/:store with no document", () =>
    createDocument()()
      .map((r) => (assertEquals(r.ok, false), r))
      .map((r) => (assertEquals(r.status, 400), r))
      //.map(r => (assertEquals(r.msg, 'empty document not allowed'), r))
      .toPromise());
}
