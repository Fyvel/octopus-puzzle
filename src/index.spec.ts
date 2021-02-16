'use strict'

import ReleaseRetention from './ReleaseRetention'
import Data1 from './tests/examples/1'
import Data2 from './tests/examples/2'
import Data3 from './tests/examples/3'

const examples = {
	1: Data1,
	2: Data2,
	3: Data3,
}

for (const key in examples) {
	if (!Object.prototype.hasOwnProperty.call(examples, key))
		throw new Error('Nope')

	const example = examples[key]


	// Arrange
	const numberOfRelease = 2
	const expected = example.Expected[numberOfRelease]

	console.group(`Example ${key} with ${numberOfRelease} Releases`)

	if (!expected) {
		console.info(`No test data for Example ${key} with ${numberOfRelease} Releases`)
		console.groupEnd()
		break
	}

	// Act
	const releasesKept = ReleaseRetention
		.Create(example)
		.Keep(numberOfRelease)
	const results = [...releasesKept.data.values()].map(x => x.ReleaseId)

	// Assert

	// same number of result
	console.group('Should be the same size')
	const assertLength = results.length === expected.length
	console.assert(assertLength, {
		result: results.length,
		expected: expected.length
	}, "❌ Oh no...")
	if (assertLength)
		console.log('✅ Test Passed - GREAT SUCCESS')
	console.groupEnd()

	// same items
	console.group('Should have the same items')
	expected.forEach((expect, idx) => {
		const assertSameItems = results.includes(expect)
		console.assert(assertSameItems, {
			result: results[idx], expected
		}, "❌ Oh no...")
		if (assertSameItems)
			console.log('✅ Test Passed - GREAT SUCCESS')
	})
	console.groupEnd()

	console.groupEnd()
}

