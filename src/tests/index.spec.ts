'use strict'

import ReleaseRetention from '../ReleaseRetention'
import Data1 from './examples/1'
import Data2 from './examples/2'
import Data3 from './examples/3'
import { DataType } from '../types'

const SCENARIO = [0, 1, 2, 3, 4]
const DATASET = [Data1, Data2, Data3]

//#region Setup

enum ExampleOptions { toTest = 'toTest', toSkip = 'toSkip' }
type ExampleType = [number, number, DataType, { [key: number]: string[] }][]
const EXAMPLES = DATASET.reduce((acc, curr, idx) => {
	const { Expected: expected, ...dataset } = curr
	SCENARIO.forEach(nbOfRelease => {
		expected[nbOfRelease]
			? acc.toTest.push([idx + 1, nbOfRelease, dataset, expected])
			: acc.toSkip.push([idx + 1, nbOfRelease, dataset, expected])
	})
	return acc
}, {
	toTest: [],
	toSkip: [],
} as { [key in ExampleOptions]: ExampleType })

//#endregion

describe('Integratin tests', () => {
	test.each(EXAMPLES.toTest)(`Should work for Example #%i with %i release(s) to retain 👨‍🔬`,
		(_, numberOfRelease, example, exampleResults) => {

			// Arrange
			const expected = exampleResults[numberOfRelease]

			// Act
			const releasesKept = ReleaseRetention
				.Create(example)
				.Keep(numberOfRelease)
			const results = [...releasesKept.data.values()].map(x => x.ReleaseId)

			// Assert
			expect(results.length).toBe(expected.length)
			expect(results).toEqual(expect.arrayContaining(expected))
		})

	EXAMPLES.toSkip.length &&
		test.skip.each(EXAMPLES.toSkip)(`Example #%i with %i release(s) to retain - No test data 🤷‍♂️`,
			() => { })
})
