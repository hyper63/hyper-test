import { assertEquals } from 'https://deno.land/std@0.106.0/testing/asserts.ts'

import connect from '../mod.js'

const test = Deno.test

test('add data', async () => {
  const hyper = connect('http://u:p@localhost:6363/foo')()
  const request = await hyper.data.add({ type: 'test', title: 'Hello World' })
  assertEquals(request.url, 'http://localhost:6363/data/foo')
  assertEquals(request.headers.get('authorization'), 'Bearer eyJhbGciOiJIUzI1NiIsInR5cGUiOiJKV1QifQ.eyJzdWIiOiJ1In0.5YCvIgIKQi-MCkq5mqvUpFxwKEV52IFJi4wJljXNISQ')
  const body = await request.json()
  assertEquals(body, { type: 'test', title: 'Hello World' })
})