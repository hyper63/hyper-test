import { $fetch, toJSON } from "../lib/utils.js";
import { assert, assertEquals } from "asserts";

const test = Deno.test;

export default function (cache) {
  const createKV = (key, value) => $fetch(cache.add(key, value)).chain(toJSON);

  const cleanUp = (key) => $fetch(cache.remove(key)).chain(toJSON);


  const createDocForDb = (db, key, value) => {
    let req = cache.add(key, value)
    let _req = new Request(req.url + 'db', {
      method: 'POST',
      headers: req.headers,
      body: JSON.stringify({ key, value })
    })
    return $fetch(_req).chain(toJSON);
  }


  test("POST /cache/:store successfully", () =>
    createKV("1", { type: "movie", title: "Ghostbusters" })
      .map((r) => (assert(r.ok), r))
      .map((r) => (console.log(r), r))
      .chain(() => cleanUp("1"))
      .toPromise());

  test("POST /cache/:store document conflict", () =>
    createKV("2", { type: "movie", title: "Caddyshack" })
      .chain(() => createKV("2", { type: "movie", title: "Caddyshack 2" }))
      .map((r) => (assertEquals(r.ok, false), r))
      .map((r) => (assertEquals(r.status, 409), r.id))
      .chain(() => cleanUp("2"))
      .toPromise());

  // return error if store does not exist
  test("POST /cache/:store error if store does not exist", () =>
    createDocForDb("none", "30", { type: "badfood" })
      .map((r) => {
        assertEquals(r.ok, false);
        assertEquals(r.status, 400);
        return r;
      })
      .toPromise());

  test("POST /cache/:store with no document", () =>
    createKV()
      .map((r) => (assertEquals(r.ok, false), r))
      .map((r) => (assertEquals(r.status, 500), r))
      //.map(r => (assertEquals(r.msg, 'empty document not allowed'), r))
      .toPromise());

}
