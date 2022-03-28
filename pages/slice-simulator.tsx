import { SliceSimulator } from '@prismicio/slice-simulator-react'
import { SliceZone } from '@prismicio/react'

import { components } from '../slices/index'
import state from '../.slicemachine/libraries-state.json'

const SliceSimulatorPage = () => {
	return (
		<SliceSimulator
			// @ts-expect-error
			sliceZone={({ slices }) => <SliceZone slices={slices} components={components} />}
			// @ts-expect-error
			state={state}
		/>
	)
}

export default SliceSimulatorPage
