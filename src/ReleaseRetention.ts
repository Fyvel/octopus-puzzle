'use strict'

import {
	DataType,
	Deployment,
	Release,
	Result
} from "./types"

export default (function () {
	type ProcessProjectEnvironmentsProps = {
		projectIds: string[],
		environmentIds: string[],
		releases: Release[],
		deployments: Deployment[],
	}
	const _processProjectEnvironments = ({
		projectIds,
		environmentIds,
		releases,
		deployments,
	}: ProcessProjectEnvironmentsProps) => projectIds.reduce(
		(projEnvAcc, proj) => {
			// get relevant Release Ids
			const releaseIds = releases
				.filter(r => r.ProjectId === proj)
				.map(x => x.Id)
			// loop through the environments
			environmentIds.forEach(env => {
				// create Project/Environment key
				const key = `${proj}_${env}}`
				// keep relevant deployments
				const deploymentsInvolved = deployments
					.filter(d => d.EnvironmentId === env
						&& releaseIds.includes(d.ReleaseId))
					.sort((a, b) => +new Date(b.DeployedAt) - +new Date(a.DeployedAt))
					.reduce((releaseTracker, depl) => {
						// skip releases that have been seen already
						if (releaseTracker.releaseSeen.has(depl.ReleaseId))
							return releaseTracker
						// otherwise add it to the tracker
						releaseTracker.releaseSeen.add(depl.ReleaseId)
						releaseTracker.deployments.push(depl)
						return releaseTracker
					}, {
						releaseSeen: new Set<string>(),
						deployments: [] as Deployment[]
					})
					.deployments
				// add remaining deployments to Project/Environment key
				projEnvAcc.set(key, deploymentsInvolved)
				return
			})
			return projEnvAcc
		}, new Map<ProjEnvKey, Deployment[]>())

	function Create({
		Releases,
		Deployments,
		Environments,
		Projects }: DataType) {
		try {
			// get target project Ids
			const targetProjs = [...Projects.reduce(
				(acc, curr) => {
					acc.add(curr.Id)
					return acc
				}, new Set<string>())]
			// get target environment Ids
			const targetEnvs = [...Environments.reduce(
				(acc, curr) => {
					acc.add(curr.Id)
					return acc
				}, new Set<string>())]
			// filter out relevant releases
			const releases = Releases
				.filter(r => targetProjs.includes(r.ProjectId))
			// filter out relevant deployments
			const deployments = Deployments
				.filter(d => targetEnvs.includes(d.EnvironmentId))
			// get Project/Environment pairs
			const projectEnvironments = _processProjectEnvironments({
				projectIds: targetProjs,
				environmentIds: targetEnvs,
				releases,
				deployments,
			})

			return {
				Keep: (nbOfReleases: number) => KeepFactory({
					projectEnvironments,
					nbOfReleases
				})
			}
		} catch (error) {
			const err = new Error(error)
			throw err
		}
	}

	type ProjEnvKey = string
	type KeepFactoryParams = {
		projectEnvironments: Map<ProjEnvKey, Deployment[]>,
		nbOfReleases: number
	}

	function KeepFactory({
		projectEnvironments,
		nbOfReleases
	}: KeepFactoryParams): Result {
		try {
			const result = new Set<string>()
			projectEnvironments.forEach(projEnv => {
				[...projEnv.values()]
					.slice(0, nbOfReleases)
					.forEach(deployment => {
						result.add(deployment.ReleaseId)
						console.debug(`+ Keep Release [${deployment.ReleaseId}] / Environment [${deployment.EnvironmentId}] / Deployment [${deployment.Id}]`)
					})
			})

			return {
				data: result,
				toString: () => [...result].join(' - ')
			}
		} catch (error) {
			const err = new Error(error)
			throw err
		}
	}

	return {
		Create,
		KeepFactory,
	}
})()