import { $fetch, toJSON } from "../lib/utils.js";
import { assert, assertEquals } from "asserts";

const test = Deno.test;

export default function (cache) {
  const add = (key, value) => $fetch(cache.add(key, value)).chain(toJSON);
  const set = (key, value) => $fetch(cache.set(key, value)).chain(toJSON);
  const remove = (key) => $fetch(cache.remove(key)).chain(toJSON);
  const query = (pattern) => $fetch(cache.query(pattern)).chain(toJSON)

  test('POST /cache/:store/_query? - list all', () =>
    // setup
    add('movie-1', { title: 'Superman' })
      .chain(() => add('movie-2', { title: 'Batman' }))
      .chain(() => add('movie-3', { title: 'Spiderman' }))
      .chain(() => add('album-1', { title: 'The Doors' }))
      // test
      .chain(() => query())
      .map(r => (console.log(r), r))
      .map(r => (assertEquals(r.ok, true), r))
      .map(r => (assertEquals(r.docs.length, 4), r))
      // clean up
      .chain(() => remove('movie-1'))
      .chain(() => remove('movie-2'))
      .chain(() => remove('movie-3'))
      .chain(() => remove('album-1'))

      .toPromise()
  )

  test('POST /cache/:store/_query?pattern=movie* - list movies', () =>
    // setup
    add('movie-1', { title: 'Superman' })
      .chain(() => add('movie-2', { title: 'Batman' }))
      .chain(() => add('movie-3', { title: 'Spiderman' }))
      .chain(() => add('album-1', { title: 'The Doors' }))
      // test
      .chain(() => query('movie-*'))
      //.map(r => (console.log(r), r))
      .map(r => (assertEquals(r.ok, true), r))
      .map(r => (assertEquals(r.docs.length, 3), r))
      // clean up
      .chain(() => remove('movie-1'))
      .chain(() => remove('movie-2'))
      .chain(() => remove('movie-3'))
      .chain(() => remove('album-1'))

      .toPromise()
  )

  test('POST /cache/:store/_query?pattern=*-movie - keys ends with movies', () =>
    // setup
    add('1-movie', { title: 'Superman' })
      .chain(() => add('2-movie', { title: 'Batman' }))
      .chain(() => add('3-movie', { title: 'Spiderman' }))
      .chain(() => add('1-album', { title: 'The Doors' }))
      // test
      .chain(() => query('*-movie'))
      //.map(r => (console.log(r), r))
      .map(r => (assertEquals(r.ok, true), r))
      .map(r => (assertEquals(r.docs.length, 3), r))
      // clean up
      .chain(() => remove('1-movie'))
      .chain(() => remove('2-movie'))
      .chain(() => remove('3-movie'))
      .chain(() => remove('1-album'))

      .toPromise()
  )

}