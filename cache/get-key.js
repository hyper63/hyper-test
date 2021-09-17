import { $fetch, toJSON } from "../lib/utils.js";
import { assert, assertEquals } from "asserts";

const test = Deno.test;

export default function (cache) {
  const add = (key, value) => $fetch(cache.add(key, value)).chain(toJSON);
  const get = (key) => $fetch(cache.get(key)).chain(toJSON);
  const remove = (key) => $fetch(cache.remove(key)).chain(toJSON);

  test("GET /cache/:store/:key - get value from key", () =>
    add("test-20", { type: "movie", title: "Batman" })
      .chain(() => get("test-20"))
      .map((v) => (assertEquals(v.title, "Batman"), v))
      .chain(() => remove("test-20"))
      .toPromise());

  test("GET /cache/:store/:key - 404 key does not exist", () =>
    get("test-30")
      .map((r) => (assertEquals(r.ok, false), r))
      .map((r) => (assertEquals(r.status, 404), r))
      .toPromise());
}
