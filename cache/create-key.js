import { $, $fetch, toJSON } from "../lib/utils.js";
import { assert, assertEquals } from "asserts";

const test = Deno.test;

export default function (cache) {
  const createKV = (key, value, ttl) =>
    $fetch(cache.add(key, value, ttl)).chain(toJSON);

  const cleanUp = (key) => $fetch(cache.remove(key)).chain(toJSON);

  const createDocForDb = async (key, value) => {
    let req = await cache.add(key, value);
    let _req = new Request(req.url + "db", {
      method: "POST",
      headers: req.headers,
      body: JSON.stringify({ key, value }),
    });

    return $fetch(Promise.resolve(_req)).chain(toJSON);
  };

  test("POST /cache/:store successfully", () =>
    createKV("1", { type: "movie", title: "Ghostbusters" })
      .map((r) => (assert(r.ok), r))
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
  test("POST /cache/:store error if store does not exist", async () =>
    (await createDocForDb("30", { type: "badfood" }))
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

  /*
  test("POST /cache/:store with ttl", () =>
    createKV("10", { type: 'movie', title: 'Avengers' }, '10s')
      //.chain($.fromPromise(new Promise(r => setTimeout(r, 15000))))
      //.chain(() => $fetch(cache.get("10")))
      .map(v => (assertEquals(true, true), v))
      .map(v => (console.log(v), v))
      .toPromise())
  */
}
