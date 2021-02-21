'use strict'

import {
	DeploymentRelease,
	DataType,
	Deployment,
	Release,
	Result,
	Project,
	Environment
} from "./types"

// Type for Project/Environment combinaison
type ProjectEnvironment = Map<string, { Releases: Map<string, DeploymentRelease> }>

export default (function ReleaseRetention() {
	function Create({
		Releases,
		Deployments,
		Environments,
		Projects }: DataType) {
		try {
			// filter out unknwon projects from Releases
			const releasesToProcess = findReleasesToProcess(Releases, Projects, new Set<string>())

			// filter out unknown environments from Deployments
			const deploymentsToProcess = findDeploymentsToProcess(Deployments, Environments, new Set<string>())

			// group by project/environment combinaisons
			const map = groupByProjectEnvironment(releasesToProcess, deploymentsToProcess, new Map())
			return { Keep: Keep(map) }
		} catch (error) {
			const err = new Error(error)
			throw err
		}
	}

	function Keep(projectEnvironmentMap: ProjectEnvironment) {
		return (numberOfRelease: number): Result => {
			try {
				if (!projectEnvironmentMap.size) {
					console.debug('No existing Project/Environment combinaison')
					return {
						data: new Map(),
						toString: () => 'No existing Project/Environment combinaison'
					}
				}

				const releasesToKeep = new Map<string, DeploymentRelease>()

				const sortByDeploymentDateDesc = (a: { DeployedAt: string }, b: { DeployedAt: string }) => +new Date(b.DeployedAt) - +new Date(a.DeployedAt)

				// Loop through existing project/environment
				projectEnvironmentMap.forEach((values) => {
					[...values.Releases.values()]
						.sort(sortByDeploymentDateDesc)
						// keep n releases
						.slice(0, numberOfRelease)
						// log them & add them to the result
						.map(x => {
							console.debug(`+ Keep Release [${x.ReleaseId}] / Project [${x.ProjectId}] / Environment [${x.EnvironmentId}] / Deployment [${x.DeploymentId}]`)
							releasesToKeep.set(x.ReleaseId, x)
							return x
						})
				})

				return {
					data: releasesToKeep,
					toString: () => [...releasesToKeep.keys()].join(' - '),
				}
			} catch (error) {
				const err = new Error(error)
				throw err
			}
		}
	}

	return { Create, Keep }
})()

export {
	findReleasesToProcess,
	findDeploymentsToProcess,
	groupByProjectEnvironment,
	ProjectEnvironment,
}

const findReleasesToProcess = (
	releases: Release[],
	projects: Project[],
	currentSet = new Set<string>()) => {

	const projectSet = projects.reduce(_identifierReducer, currentSet)
	const releasesToProcess = releases.filter(r => projectSet.has(r.ProjectId))
	return releasesToProcess
}

const findDeploymentsToProcess = (
	deployments: Deployment[],
	environments: Environment[],
	currentSet = new Set<string>()) => {

	const projectSet = environments.reduce(_identifierReducer, currentSet)
	const deploymentsToProcess = deployments.filter(d => projectSet.has(d.EnvironmentId))
	return deploymentsToProcess
}

const groupByProjectEnvironment = (
	releases: Release[],
	deployments: Deployment[],
	currentMap: ProjectEnvironment = new Map()) => {

	const projectEnvironmentReducer = (deployments: Deployment[]) =>
		(acc: ProjectEnvironment, curr: Release) => {
			deployments
				.filter(deployment => deployment.ReleaseId === curr.Id)
				.forEach(deployment => {
					const projEnvKey = `${curr.ProjectId}_${deployment.EnvironmentId}`
					const deployRelKey = `${deployment.Id}_${deployment.ReleaseId}`

					console.debug(`+ Release [${curr.Id}] added to key [${projEnvKey}]`)

					const releaseDto: DeploymentRelease = {
						DeploymentId: deployment.Id,
						DeployedAt: deployment.DeployedAt,
						EnvironmentId: deployment.EnvironmentId,
						ProjectId: curr.ProjectId,
						ReleaseId: curr.Id,
						Created: curr.Created,
					}

					acc.has(projEnvKey)
						? acc.get(projEnvKey)?.Releases.set(deployRelKey, releaseDto)
						: acc.set(projEnvKey, { Releases: new Map().set(releaseDto.ReleaseId, releaseDto) })
					return
				})

			return acc
		}

	return releases.reduce(projectEnvironmentReducer(deployments), currentMap)
}

const _identifierReducer = (
	acc: Set<string>,
	curr: { Id: string }) => {

	acc.add(curr.Id)
	return acc
}
