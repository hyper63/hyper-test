import crocks from "crocks";
import { assoc, map } from "ramda";
import { $fetch, toJSON } from "../lib/utils.js";
import { assertEquals } from "asserts";

const { Async } = crocks;
const test = Deno.test;

const teams = [
  { id: '3001', name: 'Falcons', region: 'Atlanta' },
  { id: '3002', name: 'Panthers', region: 'Carolina' },
  { id: '3003', name: 'Cardinals', region: 'Arizona' },
  { id: '3004', name: 'Bears', region: 'Chicago' },
  { id: '3005', name: 'Eagles', region: 'Philidelphia' },
  { id: '3006', name: 'Giants', region: 'New York' }
];

export default function (url, headers) {
  const loadTeams = () =>
    /*
    const hyper = Hyper(cs)
    const req = hyper(domain).data.bulk(teams)
    const res = await $fetch(req).chain(toJSON)
    */

    $fetch(`${url}/data/test/_bulk`, {
      method: 'POST',
      headers,
      body: JSON.stringify(teams)
    }).chain(toJSON)

  const updateTeams = () =>
    $fetch(`${url}/data/test/_bulk`, {

    })
  const tearDown = () =>
    $fetch(`${url}/data/test/_bulk`, {
      method: 'POST',
      headers,
      body: JSON.stringify(map(assoc('_deleted', true), teams))
    }).chain(toJSON)

  test('POST /data/:store/_bulk - bulk with no store should return 400', () =>
    $fetch(`${url}/data/none/_bulk`, {
      method: 'POST',
      headers,
      body: JSON.stringify(teams)
    }).chain(toJSON)
      .map(r => (assertEquals(r.status, 400)))
      .toPromise()
  )

  test('POST /data/:store/_bulk - insert documents', () =>
    $fetch(`${url}/data/test/_bulk`, {
      method: 'POST',
      headers,
      body: JSON.stringify(teams)
    }).chain(toJSON)
      .map(r => (assertEquals(r.ok, true), r))
      .map(r => (assertEquals(r.results.length, 6), r))
      .chain(tearDown)
      .toPromise()
  )
  /*
  test('POST /data/:store/_bulk - update docs', () => 
    loadTeams()
      .chain(updateTeams)

  )
  */

}