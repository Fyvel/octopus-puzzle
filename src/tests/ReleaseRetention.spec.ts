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
		//#region Arrange
		const targetProjects = [
			{ Id: 'Project-A' },
			{ Id: 'Project-B' },
			{ Id: 'Project-C' }
		] as Project[]
		const releaseArray = [
			{
				Id: 'R1',
				ProjectId: 'Project-A'
			},
			{
				Id: 'R2',
				ProjectId: 'Project-B'
			},
			{
				Id: 'R3',
				ProjectId: 'Project-D'
			},
			{
				Id: 'R4',
				ProjectId: 'Project-E'
			}] as Release[]
		const expected = [{
			Id: 'R1',
			ProjectId: 'Project-A'
		},
		{
			Id: 'R2',
			ProjectId: 'Project-B'
		}] as Release[]
		//#endregion
		// Act
		const results = findReleasesToProcess(releaseArray, targetProjects)
		// Assert
		expect(results.length).toBe(expected.length)
		expect(results).toEqual(expect.arrayContaining(expected))
	})
	test('Should identify relevant deployments', () => {
		//#region Arrange
		const targetEnvironments = [
			{ Id: 'Env-A' },
			{ Id: 'Env-B' },
			{ Id: 'Env-C' }
		] as Environment[]
		const deploymentArray = [
			{
				Id: 'D1',
				EnvironmentId: 'Env-A'
			},
			{
				Id: 'D2',
				EnvironmentId: 'Env-B'
			},
			{
				Id: 'D3',
				EnvironmentId: 'Env-D'
			},
			{
				Id: 'D4',
				EnvironmentId: 'Env-E'
			}] as Deployment[]
		const expected = [{
			Id: 'D1',
			EnvironmentId: 'Env-A'
		},
		{
			Id: 'D2',
			EnvironmentId: 'Env-B'
		}] as Deployment[]
		//#endregion
		// Act
		const results = findDeploymentsToProcess(deploymentArray, targetEnvironments)
		// Assert
		expect(results.length).toBe(expected.length)
		expect(results).toEqual(expect.arrayContaining(expected))
	})
	test('Should find Project/Environemnt combinaisons', () => {
		//#region Arrange
		const releaseArray = [
			{
				Id: 'R1',
				ProjectId: 'Project-A'
			},
			{
				Id: 'R2',
				ProjectId: 'Project-B'
			},
			{
				Id: 'R3',
				ProjectId: 'Project-A'
			},
			{
				Id: 'R4',
				ProjectId: 'Project-B'
			},
			{
				Id: 'R5',
				ProjectId: 'Project-D'
			}
		] as Release[]
		const deploymentArray = [
			{
				Id: 'D1',
				EnvironmentId: 'Env-A',
				ReleaseId: 'R1' // 'Project-A'
			},
			{
				Id: 'D2',
				EnvironmentId: 'Env-B',
				ReleaseId: 'R2' // 'Project-B'
			},
			{
				Id: 'D3',
				EnvironmentId: 'Env-D',
				ReleaseId: 'R3' // 'Project-A'
			},
			{
				Id: 'D4',
				EnvironmentId: 'Env-E',
				ReleaseId: 'R4' //'Project-B'
			}] as Deployment[]
		const expected = new Map()
			.set('Project-A_Env-A', {})
			.set('Project-A_Env-D', {})
			.set('Project-B_Env-B', {})
			.set('Project-B_Env-E', {}) as ProjectEnvironment
		//#endregion
		// Act
		const result = groupByProjectEnvironment(releaseArray, deploymentArray)
		// Assert
		expect(result.size).toBe(expected.size)
		expect([...result.keys()]).toEqual(expect.arrayContaining([...expected.keys()]))
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