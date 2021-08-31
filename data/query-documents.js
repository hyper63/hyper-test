import crocks from "crocks";
import { assoc, map } from "ramda";
import { $fetch, toJSON } from "../lib/utils.js";
import { assertEquals } from "asserts";

const { Async } = crocks;
const test = Deno.test;

const albums = [
  {
    id: "2001",
    type: "album",
    title: "Nothing Shocking",
    band: "Janes Addiction",
  },
  {
    id: "2002",
    type: "album",
    title: "Appetite for Destruction",
    band: "Guns and Roses",
  },
  { id: "2003", type: "album", title: "Back in Black", band: "ACDC" },
  { id: "2004", type: "album", title: "The Doors", band: "Doors" },
  { id: "2005", type: "album", title: "Nevermind", band: "Nirvana" },
];

export default function (url, headers) {
  const setup = () =>
    $fetch(`${url}/data/test`, {
      method: "PUT",
      headers,
    })
      .chain(toJSON)
      .chain(() =>
        $fetch(`${url}/data/test/_bulk`, {
          method: "POST",
          headers,
          body: JSON.stringify(albums),
        })
      )
      .chain(toJSON);

  const query = (q) => () =>
    $fetch(`${url}/data/test/_query`, {
      method: 'POST',
      headers,
      body: JSON.stringify(q)
    })
      .chain(toJSON)

  const tearDown = () =>
    Async.of(albums)
      .map(map(assoc("_deleted", true)))
      .chain((docs) =>
        $fetch(`${url}/data/test/_bulk`, {
          method: "POST",
          headers,
          body: JSON.stringify(docs),
        })
      )
      .chain(toJSON);

  test("query documents of type album", () =>
    setup()
      .chain(query({ selector: { type: "album" } }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 5), r))
      .chain(tearDown)
      .toPromise());

  test('query documents with no selector', () =>
    setup()
      .chain(query())
      .map(v => (console.log(v), v))
      .chain(tearDown)
      .toPromise()
  )
}
