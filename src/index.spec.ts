'use strict'

import ReleaseRetention from './ReleaseRetention'
import Data from './tests/examples/1'

// Arrange
const example = 1
const numberOfRelease = 2
const expected = Data.Expected

if (!expected[numberOfRelease])
	throw new Error(`No test data for Example ${example} with ${numberOfRelease} Releases`)

// Act
const releasesKept = ReleaseRetention
	.Create(Data)
	.Keep(numberOfRelease)
const results = [...releasesKept.data.values()].map(x => x.ReleaseId)

// Assert

// same number of result
console.group('Should be the same size')
const assertLength = results.length === expected[numberOfRelease].length
console.assert(assertLength, {
	result: results.length,
	expected: expected[numberOfRelease].length
}, "❌ Oh no...")
if (assertLength)
	console.log('✅ Test Passed - GREAT SUCCESS')
console.groupEnd()

// same items
console.group('Should have the same items in the same order')
expected[numberOfRelease].forEach((expect, idx) => {
	const assertSameItems = results[idx] === expect
	console.assert(assertSameItems, {
		result: results[idx], expected
	}, "❌ Oh no...")
	if (assertSameItems)
		console.log('✅ Test Passed - GREAT SUCCESS')
})
console.groupEnd()
