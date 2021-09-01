import { crocks, R } from '../deps.js'

const { Reader, chain } = crocks
const { compose } = R

const addBody = body => Reader.ask(req => new Request(req, { method: 'POST', body: JSON.stringify(body) }))
const addQueryParams = params => Reader.ask(req => new Request(`${req.url}?${params}`, {
  headers: req.headers
}))

const add = body =>
  Reader.of(body)
    .chain(addBody)

const list = (params = {}) =>
  Reader.of(params)
    .map(p => new URLSearchParams(p).toString())
    .chain(addQueryParams)

export default {
  add,
  list
  /*
  update,
  remove,
  query,
  bulk,
  get,
  list
  */
}

