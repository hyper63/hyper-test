import { crocks } from "../deps.js";

const { Reader } = crocks;

const appendPath = (id) =>
  Reader.ask((req) =>
    new Request(`${req.url}/${id}`, {
      headers: req.headers,
    })
  );

const create = () => Reader.ask((req) => new Request(req, { method: "PUT" }));

const destroy = (confirm = false) =>
  confirm
    ? Reader.ask((req) => new Request(req, { method: "DELETE" }))
    : Reader.of({ msg: "not confirmed" });

const add = (key, value, ttl) =>
  Reader.ask((req) =>
    new Request(req, {
      method: "POST",
      body: JSON.stringify({ key, value, ttl }),
    })
  );

const remove = (key) =>
  appendPath(key)
    .map((req) => new Request(req, { method: "DELETE" }));

const get = appendPath;

export default {
  create,
  destroy,
  add,
  get,
  remove,
  /*
  set,
  query,
  */
};
