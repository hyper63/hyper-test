import crocks from 'crocks'
import { map } from 'ramda'
import { $fetch, toJSON } from "../lib/utils.js";
import { assertEquals } from "asserts";

const { Async } = crocks
const test = Deno.test;

const albums = [
  { id: '1001', type: 'album', title: 'Nothing Shocking', band: 'Janes Addiction' },
  { id: '1002', type: 'album', title: 'Appetite for Destruction', band: 'Guns and Roses' },
  { id: '1003', type: 'album', title: 'Back in Black', band: 'ACDC' },
  { id: '1004', type: 'album', title: 'The Doors', band: 'Doors' },
  { id: '1005', type: 'album', title: 'Nevermind', band: 'Nirvana' },
]

export default function (url, headers) {

  test('query documents of type album', () =>
    setup()
      .chain(query({ selector: { type: 'album' } }))
      .map(r => (assertEquals(r.ok, true), r))
      .map(r => (assertEquals(r.matches.length, 5), r))
      .toPromise()
  )
}