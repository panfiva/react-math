import { Fragment } from 'react'

import { useCreatePath, Identifier } from 'react-admin'

import { SafeTitle } from '../../lib/SafeTitle'

import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import MuiButton from '@mui/material/Button'

export type ItemProps = {
	resource: string
	title: string
	description?: string
}

export const Apps = (): JSX.Element | null => {
	return (
		<Fragment>
			<SafeTitle title='Apps' />
			<Box sx={{ p: 1, height: '100%' }}>
				<Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
					{/* <Item resource='addition' title='Addition' /> */}
					<Item resource='Multiplication' title='Multiplication' />
				</Box>
			</Box>
		</Fragment>
	)
}

const Item = (props: ItemProps & { id?: Identifier }) => {
	const createPath = useCreatePath()

	return (
		<Box sx={{ p: 1 }}>
			<MuiButton
				component={Link}
				variant='outlined'
				to={createPath({ type: 'list', resource: props.resource })}
			>
				{props.title}
			</MuiButton>
		</Box>
	)
}
