'use strict'

import { performance } from 'perf_hooks'

import ReleaseRetention from './ReleaseRetention'
import Data from './data'

const numberOfRelease = 10

const start = performance.now()
const releasesKept = ReleaseRetention.Create(Data).Keep(numberOfRelease)
const end = performance.now()

console.info(JSON.stringify(`${releasesKept}`, null, 2))
console.log(`Last for ${end - start} ms`)