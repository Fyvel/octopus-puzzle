'use strict'

import ReleaseRetention from './ReleaseRetention'
import Data from './data'

const numberOfRelease = 2

const rr = ReleaseRetention(Data).keep(numberOfRelease)

console.log(JSON.stringify(rr, null, 2))
