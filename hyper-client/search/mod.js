import { crocks } from "../deps.js";

const { Reader } = crocks;

const create = (fields, storeFields) => Reader.ask((req) =>
  new Request(req, { method: "PUT", body: JSON.stringify({ fields, storeFields }) })
);

const destroy = (confirm = false) =>
  confirm
    ? Reader.ask((req) => new Request(req, { method: "DELETE" }))
    : Reader.of({ msg: "not confirmed" });

export default {
  create,
  destroy
}