import { default as hyper } from "https://x.nest.land/hyper@1.4.3/mod.js";
import { default as app } from "https://x.nest.land/hyper-app-opine@1.2.2/mod.js";

// adapters
import { default as dndb } from "https://x.nest.land/hyper-adapter-dndb@0.0.12/mod.js";
//import dndb from 'https://raw.githubusercontent.com/hyper63/hyper-adapter-dndb/main/mod.js'

//import dndb from 'https://3000-emerald-koi-qusd8ghs.ws-us16.gitpod.io/mod.js'
// import { default as memory } from "https://x.nest.land/hyper-adapter-memory@1.2.6/mod.js";
// import { default as fs } from "https://x.nest.land/hyper-adapter-fs@1.0.8/mod.js";
// import { default as minisearch } from "https://x.nest.land/hyper-adapter-minisearch@1.0.11/mod.js";

hyper({
  app,
  adapters: [
    { port: "data", plugins: [dndb({ dir: "/tmp" })] },
  ],
});
