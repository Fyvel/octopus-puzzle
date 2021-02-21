
export type Deployment = {
	Id: string
	ReleaseId: string
	EnvironmentId: string
	DeployedAt: string
}
export type Environment = {
	Id: string
	Name: string
}
export type Project = {
	Id: string
	Name: string
}
export type Release = {
	Id: string
	ProjectId: string
	Version: string | null
	Created: string
}
export type DataType = {
	Deployments: Deployment[],
	Environments: Environment[],
	Projects: Project[],
	Releases: Release[],
}

// Dto type to carry needed stuff along the way
export type DeploymentRelease = {
	ReleaseId: string,
	Created: string,
	EnvironmentId: string,
	ProjectId: string,
	DeploymentId: string,
	DeployedAt: string,
}

// Final result type
export type Result = {
	data: Map<string, DeploymentRelease>,
	toString: () => string
}