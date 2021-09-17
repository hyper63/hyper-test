import { default as hyper } from "https://x.nest.land/hyper@1.4.9/mod.js";
import { default as app } from "https://x.nest.land/hyper-app-opine@1.2.4/mod.js";

// adapters
import { default as dndb } from "https://x.nest.land/hyper-adapter-dndb@1.0.0/mod.js";
import { default as cache } from 'https://x.nest.land/hyper-adapter-sqlite@1.0.0/mod.js'
// import { default as fs } from "https://x.nest.land/hyper-adapter-fs@1.0.8/mod.js";
import { default as search } from "https://x.nest.land/hyper-adapter-minisearch@1.1.0/mod.js";

const TMP = '/tmp'

hyper({
  app,
  adapters: [
    { port: "data", plugins: [dndb({ dir: TMP })] },
    { port: "cache", plugins: [cache({ dir: TMP })] },
    { port: "search", plugins: [search({ dir: TMP })] },
  ],
});
