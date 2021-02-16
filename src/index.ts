'use strict'

import ReleaseRetention from './ReleaseRetention'
import Data from './data'

const numberOfRelease = 10

const releasesKept = ReleaseRetention.Create(Data).Keep(numberOfRelease)

console.log(JSON.stringify(releasesKept, null, 2))
