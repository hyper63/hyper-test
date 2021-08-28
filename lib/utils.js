import crocks from 'crocks'

const { Async } = crocks
export const $fetch = Async.fromPromise(fetch)
export const toJSON = res => res.ok
  ? Async.fromPromise(res.json.bind(res))()
  : Async.Rejected({ ok: false, status: res.status })