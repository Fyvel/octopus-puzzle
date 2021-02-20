'use strict'

import ReleaseRetention, {
	findDeploymentsToProcess,
	findReleasesToProcess,
	groupByProjectEnvironment,
	ProjectEnvironment
} from '../ReleaseRetention'
import {
	Deployment,
	Environment,
	Project,
	Release,
	Result
} from '../types'

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
		//#region Arrange
		const numberAsParam = 42//ReleaseRetention.Keep(new Map())
		const targetMethod = ReleaseRetention.Keep(new Map())
		const mock = jest.fn() as jest.MockedFunction<typeof targetMethod>
		//#endregion
		// Act
		mock(numberAsParam)
		// Assert
		expect(mock).toBeCalledWith(expect.any(Number))
	})

	test('Should return the releases that should be kept', () => {
		//#region Arrange
		const projEnvMap = new Map()
			.set('Project-A_Env-A', {
				Releases: new Map()
					.set('R1', {
						ReleaseId: 'R1',
						Created: '2021-02-18T09:00:00.000Z',
						EnvironmentId: 'Env-A',
						ProjectId: 'Project-A',
						DeploymentId: 'D4',
						DeployedAt: '2021-02-18T09:00:00.000Z',
					})
					.set('R2', {
						ReleaseId: 'R2',
						Created: '2021-02-18T10:00:00.000Z',
						EnvironmentId: 'Env-A',
						ProjectId: 'Project-A',
						DeploymentId: 'D5',
						DeployedAt: '2021-02-18T10:00:00.000Z',
					})
					.set('R3', {
						ReleaseId: 'R3',
						Created: '2021-02-18T11:00:00.000Z',
						EnvironmentId: 'Env-A',
						ProjectId: 'Project-A',
						DeploymentId: 'D6',
						DeployedAt: '2021-02-18T11:00:00.000Z',
					})
			})
			.set('Project-A_Env-B', {
				Releases: new Map()
					.set('R4', {
						ReleaseId: 'R4',
						Created: '2021-02-18T12:00:00.000Z',
						EnvironmentId: 'Env-B',
						ProjectId: 'Project-A',
						DeploymentId: 'D4',
						DeployedAt: '2021-02-18T12:00:00.000Z',
					})
					.set('R5', {
						ReleaseId: 'R5',
						Created: '2021-02-18T13:00:00.000Z',
						EnvironmentId: 'Env-B',
						ProjectId: 'Project-A',
						DeploymentId: 'D5',
						DeployedAt: '2021-02-18T13:00:00.000Z',
					})
			}) as ProjectEnvironment
		const expected = {
			data: new Map()
				.set('R2', {})
				.set('R3', {})
				.set('R4', {})
				.set('R5', {})
		} as Result
		const numberOfRelease = 2
		//#endregion
		// Act
		const results = ReleaseRetention.Keep(projEnvMap)(numberOfRelease)
		// Assert
		expect(results.data.size).toBe(expected.data.size)
		expect([...results.data.keys()])
			.toEqual(expect.arrayContaining([...expected.data.keys()]))

	})

	test('Should not retain duplicate releases', () => {
		//#region Arrange
		const projEnvMap = new Map()
			.set('Project-A_Env-A', {
				Releases: new Map()
					.set('R1', {
						ReleaseId: 'R1',
						Created: '2021-02-18T09:00:00.000Z',
						EnvironmentId: 'Env-A',
						ProjectId: 'Project-A',
						DeploymentId: 'D4',
						DeployedAt: '2021-02-18T09:00:00.000Z',
					})
					.set('R2', {
						ReleaseId: 'R2',
						Created: '2021-02-18T10:00:00.000Z',
						EnvironmentId: 'Env-A',
						ProjectId: 'Project-A',
						DeploymentId: 'D5',
						DeployedAt: '2021-02-18T10:00:00.000Z',
					})
			})
			.set('Project-A_Env-B', {
				Releases: new Map()
					.set('R1', {
						ReleaseId: 'R1',
						Created: '2021-02-18T09:00:00.000Z',
						EnvironmentId: 'Env-B',
						ProjectId: 'Project-A',
						DeploymentId: 'D6',
						DeployedAt: '2021-02-18T09:00:00.000Z',
					})
					.set('R2', {
						ReleaseId: 'R2',
						Created: '2021-02-18T10:00:00.000Z',
						EnvironmentId: 'Env-B',
						ProjectId: 'Project-A',
						DeploymentId: 'D7',
						DeployedAt: '2021-02-18T10:00:00.000Z',
					})
			}) as ProjectEnvironment
		const expected = {
			data: new Map()
				.set('R1', {})
				.set('R2', {})
		} as Result
		const numberOfRelease = 2
		//#endregion
		// Act
		const results = ReleaseRetention.Keep(projEnvMap)(numberOfRelease)
		// Assert
		expect(results.data.size).toBe(expected.data.size)
		expect([...results.data.keys()])
			.toEqual(expect.arrayContaining([...expected.data.keys()]))
	})

	test('Should sort releases by creation date descending', () => {
		//#region Arrange
		const projEnvMap = new Map()
			.set('Project-A_Env-B', {
				Releases: new Map()
					.set('R-older', {
						ReleaseId: 'R-older',
						Created: '2021-02-18T09:00:00.000Z',
						EnvironmentId: 'Env-B',
						ProjectId: 'Project-A',
						DeploymentId: 'D6',
						DeployedAt: '2021-02-18T09:00:00.000Z',
					})
					.set('R-latest', {
						ReleaseId: 'R-latest',
						Created: '2021-02-18T10:00:00.000Z',
						EnvironmentId: 'Env-B',
						ProjectId: 'Project-A',
						DeploymentId: 'D7',
						DeployedAt: '2021-02-18T10:00:00.000Z',
					})
			}) as ProjectEnvironment
		const expected = {
			data: new Map().set('R-latest', {})
		} as Result
		const numberOfRelease = 1
		//#endregion
		// Act
		const results = ReleaseRetention.Keep(projEnvMap)(numberOfRelease)
		// Assert
		expect(results.data.size).toBe(expected.data.size)
		expect([...results.data.keys()])
			.toEqual(expect.arrayContaining([...expected.data.keys()]))
	})

	test('Should handle empty Project/Environment Map', () => {
		// Arrange 
		const numberOfReleases = 42
		const emptyMap = new Map()
		const expected: Result = {
			data: new Map(),
			toString: () => ''
		}
		// Act
		const result = ReleaseRetention.Keep(emptyMap)(numberOfReleases)
		// Assert
		expect(result.data.size).toBe(expected.data.size)
	})
})

describe('ReleaseRetention logging', () => {
	test('Should log why a release is kept', () => {
		// Arrange
		const projEnvMap = new Map()
			.set('Project-A_Env-B', {
				Releases: new Map()
					.set('R1', {
						ReleaseId: 'R1',
						Created: '2021-02-18T09:00:00.000Z',
						EnvironmentId: 'Env-B',
						ProjectId: 'Project-A',
						DeploymentId: 'D6',
						DeployedAt: '2021-02-18T09:00:00.000Z',
					})
					.set('R2', {
						ReleaseId: 'R2',
						Created: '2021-02-18T10:00:00.000Z',
						EnvironmentId: 'Env-B',
						ProjectId: 'Project-A',
						DeploymentId: 'D7',
						DeployedAt: '2021-02-18T10:00:00.000Z',
					})
			}) as ProjectEnvironment
		const numberOfRelease = 2
		const consoleSpy = jest.spyOn(console, 'debug')
		const expected = numberOfRelease
		// Act
		ReleaseRetention.Keep(projEnvMap)(numberOfRelease)
		// Assert
		expect(consoleSpy).toHaveBeenCalledTimes(expected)
	})
})