import crocks from 'crocks'
import { map } from 'ramda'
import { $fetch, toJSON } from "../lib/utils.js";
import { assertEquals } from "asserts";

const { Async } = crocks
const test = Deno.test;

const docs = [
  { id: '1001', type: 'movie', title: 'Ghostbusters' },
  { id: '1002', type: 'movie', title: 'Ghostbusters 2' },
  { id: '1003', type: 'movie', title: 'Groundhog Day' },
  { id: '1004', type: 'movie', title: 'Scrooged' },
  { id: '1005', type: 'movie', title: 'Caddyshack' },
  { id: '1006', type: 'movie', title: 'Meatballs' },
  { id: '1007', type: 'movie', title: 'Stripes' },
  { id: '1008', type: 'movie', title: 'What about Bob?' },
  { id: '1009', type: 'movie', title: 'Life Aquatic' }
]

export default function (url, headers) {
  const createDb = () => $fetch(`${url}/data/test`, {
    method: 'PUT',
    headers
  }).chain(toJSON)

  const createDocument = doc => $fetch(`${url}/data/test`, {
    method: 'POST',
    headers,
    body: JSON.stringify(doc)
  }).chain(toJSON)

  const setup = () =>
    createDb()
      .chain(() => Async.all(map(createDocument, docs)))

  const listDocuments = (flags = {}) => () =>
    $fetch(`${url}/data/test?${new URLSearchParams(flags).toString()}`, {
      headers
    }).chain(toJSON)

  test('GET /data/test - get docs with no flags', () =>
    setup()
      .chain(listDocuments())
      .map(r => (console.log(r), r))
      .map(r => (assertEquals(r.ok, true), r))
      .map(r => (assertEquals(r.docs.length, 10), r))
      .toPromise()
  )


}