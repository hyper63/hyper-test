import Ask from "ask";
import { default as connect } from "./hyper-client/mod.js";

const test = Deno.test;
const ask = new Ask();
const cs = Deno.env.get("HYPER") || "http://localhost:6363/test";
console.log("hyper test suite ⚡️");
const answers = await ask.prompt([
  {
    name: "hyper",
    type: "input",
    message: `hyper (${cs}):`,
  },
]);

const hyperCS = answers.hyper === "" ? cs : answers.hyper;

//const services = ['data', 'cache', 'storage', 'search', 'queue']
const services = ["cache"];
/*
const { services } = await fetch(url, {
  headers,
}).then((r) => r.json());
*/
const hyper = connect(hyperCS)();
const runTest = (svc) => (x) => x.default(hyper[svc]);

if (services.includes("data")) {
  if (!hyper.info.isCloud) {
    // create app/domain instance
    await fetch(hyper.data.destroy(true));
    await fetch(hyper.data.create());
  }

  await import("./data/create-document.js").then(runTest("data"));
  await import("./data/retrieve-document.js").then(runTest("data"));
  await import("./data/update-document.js").then(runTest("data"));
  await import("./data/remove-document.js").then(runTest("data"));
  await import("./data/list-documents.js").then(runTest("data"));
  await import("./data/query-documents.js").then(runTest("data"));
  await import("./data/bulk-documents.js").then(runTest("data"));
}

if (services.includes("cache")) {
  if (!hyper.info.isCloud) {
    await fetch(hyper.cache.destroy(true));
    await fetch(hyper.cache.create());
  }
  await import("./cache/create-key.js").then(runTest("cache"));
}
