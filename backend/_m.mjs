console.error("start");
const t=Date.now();
await import("mongoose");
console.error("mongoose loaded in " + (Date.now()-t) + "ms");
process.exit(0);
