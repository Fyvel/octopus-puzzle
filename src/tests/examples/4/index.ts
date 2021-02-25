import Deployments from './Deployments.json'
import Environments from './Environments.json'
import Projects from './Projects.json'
import Releases from './Releases.json'

const Expected: { [key: number]: string[] } = {
	0: [],
	1: ['Release-2'],
	2: ['Release-2', 'Release-1']
}

export default {
	Deployments,
	Environments,
	Projects,
	Releases,
	Expected
}
