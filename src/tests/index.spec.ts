'use strict'

import ReleaseRetention from '../ReleaseRetention'
import Data1 from './examples/1'
import Data2 from './examples/2'
import Data3 from './examples/3'
import { DataType } from '../types'

const numberOfRelease = 1

//#region Setup
const { Expected: ExpectedDataset1, ...Dataset1 } = Data1
const { Expected: ExpectedDataset2, ...Dataset2 } = Data2
const { Expected: ExpectedDataset3, ...Dataset3 } = Data3

enum ExampleOptions { toTest = 'toTest', toSkip = 'toSkip' }
type ExampleType = [number, DataType, { [key: number]: string[] }][]
const examples: ExampleType = [
	[1, Dataset1, ExpectedDataset1],
	[2, Dataset2, ExpectedDataset2],
	[3, Dataset3, ExpectedDataset3],
]

const datasets = examples.reduce((acc, [a, b, c]) => {
	c[numberOfRelease]
		? acc.toTest.push([a, b, c])
		: acc.toSkip.push([a, b, c])
	return acc
}, {
	toTest: [],
	toSkip: [],
} as { [key in ExampleOptions]: ExampleType })
//#endregion

describe('Integratin tests', () => {
	test.each(datasets.toTest)(`Should work for Example #%i with ${numberOfRelease} release(s) to retain 👨‍🔬`,
		(_, example, exampleResults) => {

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

	datasets.toSkip.length &&
		test.skip.each(datasets.toSkip)(`Example #%i with ${numberOfRelease} release(s) to retain - No test data 🤷‍♂️`, () => { })
})
