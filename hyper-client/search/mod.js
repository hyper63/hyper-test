import { crocks } from "../deps.js";

const { ReaderT, Async, map } = crocks;
const { of, ask, lift } = ReaderT(Async)

const create = (fields, storeFields) => ask(map((req) =>
  new Request(req, { method: "PUT", body: JSON.stringify({ fields, storeFields }) })
)).chain(lift);

const destroy = (confirm = false) =>
  confirm
    ? ask(map((req) => new Request(req, { method: "DELETE" }))).chain(lift)
    : of({ msg: "not confirmed" });

const add = (key, doc) =>
  ask(map(req => new Request(req, { method: 'POST', body: JSON.stringify({ key, doc }) })))
    .chain(lift)

const remove = (key) =>
  ask(map(req => new Request(`${req.url}/${key}`, { headers: req.headers, method: 'DELETE' })))
    .chain(lift)

const get = (key) =>
  ask(map(req => new Request(`${req.url}/${key}`, { headers: req.headers })))
    .chain(lift)

const update = (key, doc) =>
  ask(map(req => new Request(`${req.url}/${key}`, { method: 'PUT', headers: req.headers, body: JSON.stringify({ key, doc }) })))
    .chain(lift)

export default {
  create,
  destroy,
  add,
  remove,
  get,
  update
}