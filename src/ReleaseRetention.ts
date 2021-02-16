'use strict'

type Deployment = {
	Id: string
	ReleaseId: string
	EnvironmentId: string
	DeployedAt: string
}
type Environment = {
	Id: string
	Name: string
}
type Project = {
	Id: string
	Name: string
}
type Release = {
	Id: string
	ProjectId: string
	Version: string | null
	Created: string
}
type DataType = {
	Deployments: Deployment[],
	Environments: Environment[],
	Projects: Project[],
	Releases: Release[],
}

// Dto type to carry needed stuff along the way
type ReleaseDto = {
	ReleaseId: string,
	Created: string,
	EnvironmentId: string,
	ProjectId: string,
	DeploymentId: string,
	DeployedAt: string,
}

// Final result type
type Result = {
	data: Map<string, ReleaseDto>,
	toString: () => string
}

export default (function ReleaseRetention() {
	const _projectEnvironmentMap: ProjectEnvironment = new Map()
	const _projectSet = new Set<string>()
	const _environmentSet = new Set<string>()
	// Type for Project/Environment combinaison
	type ProjectEnvironment = Map<string, { Releases: Map<string, ReleaseDto> }>

	function Create({
		Releases,
		Deployments,
		Environments,
		Projects }: DataType) {
		try {
			console.group('Create Release Retention')

			_projectEnvironmentMap.clear()
			_projectSet.clear()
			_environmentSet.clear()

			const identifierReducer = (acc: { add: (key: string) => void }, curr: { Id: string }) => {
				acc.add(curr.Id)
				return acc
			}

			// Type for Project/Environment combinaison
			const projectEnvironmentReducer = (deployments: Deployment[]) =>
				(acc: ProjectEnvironment, curr: Release) => {
					deployments
						.filter(deployment => deployment.ReleaseId === curr.Id)
						.forEach(deployment => {
							const projEnvKey = `${curr.ProjectId}_${deployment.EnvironmentId}`

							console.info(`+ Release [${curr.Id}] added to key [${projEnvKey}]`)

							const release: ReleaseDto = {
								DeploymentId: deployment.Id,
								DeployedAt: deployment.DeployedAt,
								EnvironmentId: deployment.EnvironmentId,
								ProjectId: curr.ProjectId,
								ReleaseId: curr.Id,
								Created: curr.Created,
							}

							acc.has(projEnvKey)
								? acc.get(projEnvKey)?.Releases.set(release.ReleaseId, release)
								: acc.set(projEnvKey, { Releases: new Map().set(release.ReleaseId, release) })
							return
						})

					return acc
				}

			// filter out unknwon projects from Releases
			console.group('Filter out unknwon projects')
			Projects.reduce(identifierReducer, _projectSet)
			const releasesToProcess = Releases.filter(r => _projectSet.has(r.ProjectId))
			console.debug({ releasesToProcess })
			console.groupEnd()

			// filter out unknown environments from Deployments
			console.group('Filter out unknwon environmnents')
			Environments.reduce(identifierReducer, _environmentSet)
			const deploymentsToProcess = Deployments.filter(d => _environmentSet.has(d.EnvironmentId))
			console.debug({ deploymentsToProcess })
			console.groupEnd()

			// group by project/environment combinaisons
			console.group('Project/Environment combinaison')
			releasesToProcess.reduce(projectEnvironmentReducer(deploymentsToProcess), _projectEnvironmentMap)
			console.debug({ _projectEnvironmentMap })
			console.groupEnd()

			console.groupEnd()

			return {
				Keep
			}
		} catch (error) {
			const err = new Error(error)
			console.error(err.message, err)
			throw err
		}
	}

	function Keep(numberOfRelease: number): Result {
		try {
			if (!_projectEnvironmentMap.size) {
				console.log('No existing Project/Environment combinaison')
				return {
					data: new Map(),
					toString: () => 'No existing Project/Environment combinaison'
				}
			}

			const releasesToKeep = new Map<string, ReleaseDto>()

			// Loop through existing project/environment
			// sort releases
			// keep n releases
			// log them & add them to the result
			const sortByDateDesc = (a: { Created: string }, b: { Created: string }) => +new Date(b.Created) - +new Date(a.Created)
			_projectEnvironmentMap.forEach((values) => {
				[...values.Releases.values()]
					// assuming we sort the release (if sort by version is needed: yarn add semver)
					.sort(sortByDateDesc)
					.slice(0, numberOfRelease)
					.map(x => {
						console.info(`RELEASE KEPT - Release [${x.ReleaseId}] / Project [${x.ProjectId}] / Environment [${x.EnvironmentId}] / Deployment [${x.DeploymentId}]`)
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
			console.error(err.message, err)
			throw err
		}
	}

	return { Create }
})()
