#!/usr/bin/env zx

const path = require("path");
const { EOL } = require("os");
import { argv } from "process";
require("dotenv").config();

const str = argv[3];

const args = {};
for (let i = 3, n = argv.length; i < n; i++) {
  if (argv[i]) args[argv[i]] = true;
}

const inc = args["-i"];
const dupOnly = args["-d"];

async function query({ user, pwd, host, path, str, insensitive }) {
  return await $`sshpass -p ${pwd} ssh ${user}@${host} 'find ${path} -maxdepth 1 ${
    insensitive ? "-iname" : "-name"
  } "*${str}*" | sort -n'`;
}
const hash = {};
function processOut(obj, source) {
  const { stdout, stderr } = obj;
  if (stderr) console.log(stderr);
  stdout
    .split(EOL)
    .filter((e) => e)
    .forEach((e) => {
      const bn = path.basename(e);
      if (hash[bn] == null) hash[bn] = [];
      hash[bn].push(source);
    });

  if (dupOnly) {
    const keys = Object.keys(hash);
    keys.forEach((e) => {
      if (hash[e].length < 2) delete hash[e];
    });
  }
}

const {
  QNAP_USER,
  QNAP_PWD,
  QNAP_HOST,
  QNAP_PATH,
  SYNOLOGY_USER,
  SYNOLOGY_PWD,
  SYNOLOGY_HOST,
  SYNOLOGY_PATH,
} = process.env;

const res1 = await query({
  user: QNAP_USER,
  pwd: QNAP_PWD,
  host: QNAP_HOST,
  path: QNAP_PATH,
  str,
  insensitive: inc,
});
const res2 = await query({
  user: SYNOLOGY_USER,
  pwd: SYNOLOGY_PWD,
  host: SYNOLOGY_HOST,
  path: SYNOLOGY_PATH,
  str,
  insensitive: inc,
});

processOut(res1, "qnap");
processOut(res2, "synology");

console.log(hash);

// Usage: ./find.mjs Jones
// Usage: ./find.mjs Jones -d -i
// Usage: ./find.mjs Jones -d
