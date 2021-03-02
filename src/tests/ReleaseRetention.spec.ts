'use strict'

import ReleaseRetention from '../ReleaseRetention'
import {
	Deployment,
	Environment,
	Project,
	Release,
} from '../types'

describe('ReleaseRetention module', () => {
	test('Should have a factory', () => {
		expect(ReleaseRetention).toMatchObject({ Create: expect.any(Function) })
	})
	test('Should have a rentention factory', () => {
		expect(ReleaseRetention).toMatchObject({ KeepFactory: expect.any(Function) })
	})
})

describe('ReleaseRetention module factory', () => {
	test('Should return a Keep method', () => {
		//#region Arrange
		const dataType = {
			Deployments: [] as Deployment[],
			Environments: [] as Environment[],
			Projects: [] as Project[],
			Releases: [] as Release[],
		}
		const expected = {
			Keep: expect.any(Function)
		}
		//#endregion
		// Act
		const result = ReleaseRetention.Create(dataType)
		// Assert
		expect(result).toStrictEqual(expected)
	})
})

describe('ReleaseRetention module retention factory', () => {
	test('Should receive some params', () => {
		//#region Arrange
		const projEnvPairs = new Map<string, Deployment[]>()
		const nbOfReleaseToKeep = 123
		const expected = {
			data: new Set(),
			toString: expect.any(Function)
		}
		//#endregion
		// Act
		const result = ReleaseRetention.KeepFactory({
			projectEnvironments: projEnvPairs,
			nbOfReleases: nbOfReleaseToKeep
		})
		// Assert
		expect(result).toEqual(expected)
	})

	test('Should keep the correct number of release per Project/Environment pairs', () => {
		//#region Arrange
		const projEnvPairs = new Map<string, Deployment[]>()
			.set('p1_e1', [
				{
					Id: "Deployment-3",
					ReleaseId: "Release-3",
					EnvironmentId: "Environment-1",
					DeployedAt: "2000-01-01T10:00:00"
				},
				{
					Id: "Deployment-2",
					ReleaseId: "Release-2",
					EnvironmentId: "Environment-1",
					DeployedAt: "2000-01-01T10:00:00"
				},
				{
					Id: "Deployment-1",
					ReleaseId: "Release-1",
					EnvironmentId: "Environment-1",
					DeployedAt: "2000-01-01T10:00:00"
				},
			])
			.set('p2_e1', [
				{
					Id: "Deployment-6",
					ReleaseId: "Release-3",
					EnvironmentId: "Environment-1",
					DeployedAt: "2000-01-01T10:00:00"
				},
				{
					Id: "Deployment-5",
					ReleaseId: "Release-2",
					EnvironmentId: "Environment-1",
					DeployedAt: "2000-01-01T10:00:00"
				},
				{
					Id: "Deployment-4",
					ReleaseId: "Release-1",
					EnvironmentId: "Environment-1",
					DeployedAt: "2000-01-01T10:00:00"
				},
			])
		const nbOfReleaseToKeep = 2
		const expected = {
			data: new Set().add('Release-3').add('Release-2'),
			toString: expect.any(Function)
		}
		//#endregion
		// Act
		const result = ReleaseRetention.KeepFactory({
			projectEnvironments: projEnvPairs,
			nbOfReleases: nbOfReleaseToKeep
		})
		// Assert
		expect(result.data.size).toEqual(expected.data.size)
		expect([...result.data.values()]).toEqual(expect.arrayContaining([...expected.data.values()]))
	})
})