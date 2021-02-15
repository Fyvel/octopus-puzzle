'use strict'

export type DataType = {
	Deployments: {
		Id: string;
		ReleaseId: string;
		EnvironmentId: string;
		DeployedAt: string;
	}[];
	Environments: {
		Id: string;
		Name: string;
	}[];
	Projects: {
		Id: string;
		Name: string;
	}[];
	Releases: {
		Id: string;
		ProjectId: string;
		Version: string | null;
		Created: string;
	}[];
}

export default function ReleaseRetention(data: DataType) {

	// prepare
	const keep = (numberOfRelease: number) => {
		
		// do the thing
		
		return 'WIP'
	}

	return ({ keep })
}