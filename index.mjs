#!/usr/bin/env zx

cd('/homes')
const str = 'test'
const res = await $`find . -maxdepth 1 -name '*${str}*' -exec basename {} \\; | sort -n`
console.log(res)