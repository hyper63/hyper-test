import data from "./data/mod.js";
import cache from "./cache/mod.js";
import search from "./search/mod.js";
import { buildRequest } from "./utils.js";

export default function (connectionString) {
  const cs = new URL(connectionString);
  const br = buildRequest(cs);
  const $ = (svc, client, action, ...args) => {
    return client[action](...args).runWith(br(svc)).toPromise();
  };

  /**
   * @param {string} domain
   */
  return function (domain = "default") {
    return {
      data: {
        add: (body) => data.add(body).runWith(br("data")).toPromise(),
        list: (params) => data.list(params).runWith(br("data")).toPromise(),
        get: (id) => data.get(id).runWith(br("data")).toPromise(),
        update: (id, body) =>
          data.update(id, body).runWith(br("data")).toPromise(),
        remove: (id) => data.remove(id).runWith(br("data")).toPromise(),
        query: (selector, options) =>
          data.query(selector, options).runWith(br("data")).toPromise(),
        bulk: (docs) => data.bulk(docs).runWith(br("data")).toPromise(),
        create: () => data.create().runWith(br("data")).toPromise(),
        destroy: (confirm) =>
          data.destroy(confirm).runWith(br("data")).toPromise(),
        index: (name, fields) =>
          data.index(name, fields).runWith(br("data")).toPromise(),
      },
      cache: {
        create: () => cache.create().runWith(br("cache")).toPromise(),
        destroy: (confirm) =>
          cache.destroy(confirm).runWith(br("cache")).toPromise(),
        add: (key, value, ttl) =>
          cache.add(key, value, ttl).runWith(br("cache")).toPromise(),
        remove: (key) => cache.remove(key).runWith(br("cache")).toPromise(),
        get: (key) => cache.get(key).runWith(br("cache")).toPromise(),
        set: (key, value, ttl) =>
          cache.set(key, value, ttl).runWith(br("cache")).toPromise(),
        query: (pattern) =>
          cache.query(pattern).runWith(br("cache")).toPromise(),
      },
      search: {
        create: (fields, storeFields) =>
          search.create(fields, storeFields).runWith(br("search")).toPromise(),
        destroy: (confirm) =>
          search.destroy(confirm).runWith(br("search")).toPromise(),
        add: (key, doc) =>
          search.add(key, doc).runWith(br("search")).toPromise(),
        remove: (key) => search.remove(key).runWith(br("search")).toPromise(),
        get: (key) => search.get(key).runWith(br("search")).toPromise(),

        //update: (key, doc) => search.update(key, doc).runWith(br("search")).toPromise(),
        update: (key, doc) => $("search", search, "update", key, doc),
        //query: (query, options) => search.query(query, options).runWith(br("search")).toPromise(),
        query: (query, options) => $("search", search, "query", query, options),
        load: (docs) => $("search", search, "load", docs),
      },
      info: {
        isCloud: cs.protocol === "cloud:",
      },
    };
  };
}
