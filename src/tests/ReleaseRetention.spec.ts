'use strict'

import ReleaseRetention, { findDeploymentsToProcess, findReleasesToProcess, groupByProjectEnvironment, ProjectEnvironment } from '../ReleaseRetention'
import { Deployment, Environment, Project, Release } from '../types'

describe('ReleaseRetention module', () => {
	test('Should have a factory', () => {
		expect(ReleaseRetention).toMatchObject({ Create: expect.any(Function) })
	})
})

describe('ReleaseRetention factory', () => {
	test('Should identify relevant releases to process', () => {
		// Arrange
		// Act
		// Assert
		expect(false).toBe(true)
	})
	test('Should identify relevant deployments', () => {
		// Arrange
		// Act
		// Assert
		expect(false).toBe(true)
	})
	test('Should find Project/Environemnt combinaisons', () => {
		// Arrange
		// Act
		// Assert
		expect(false).toBe(true)
	})
})

describe('ReleaseRetention process', () => {
	test('Should take the number to keep as parameter', () => {
		// Arrange
		// Act
		// Assert
		expect(false).toBe(true)
	})
	test('Should return the releases that should be kept', () => {
		// Arrange
		// Act
		// Assert
		expect(false).toBe(true)
	})
})

describe('ReleaseRetention logging', () => {
	test('Should log why a release is kept', () => {
		// Arrange
		// Act
		// Assert
		expect(false).toBe(true)
	})
})