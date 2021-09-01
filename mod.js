import Ask from "ask";
import { default as connect } from './hyper-client/mod.js'

const test = Deno.test;
const ask = new Ask();

console.log("hyper test suite ⚡️");
const answers = await ask.prompt([
  {
    name: "hyper",
    type: "input",
    message: "hyper (http://localhost:6363/test):",
  },
]);

const hyperCS = answers.hyper === "" ? "http://localhost:6363/test" : answers.hyper

const services = ['data', 'cache', 'storage', 'search', 'queue']
/*
const { services } = await fetch(url, {
  headers,
}).then((r) => r.json());
*/
const hyper = connect(hyperCS)()
// create app/domain instance
await fetch(hyper.data.destroy(true))
await fetch(hyper.data.create())

const runTest = svc => (x) => x.default(hyper[svc]);


if (services.includes("data")) {
  await import("./data/create-document.js").then(runTest('data'));
  await import("./data/retrieve-document.js").then(runTest('data'));
  await import("./data/update-document.js").then(runTest('data'));
  await import("./data/remove-document.js").then(runTest('data'));
  await import("./data/list-documents.js").then(runTest('data'));
  await import("./data/query-documents.js").then(runTest('data'));
  await import("./data/bulk-documents.js").then(runTest('data'));
}
