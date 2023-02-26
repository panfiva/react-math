import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Dispatch, SetStateAction } from 'react'

import ClearIcon from '@mui/icons-material/Clear'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export type NumberPadState = {
	item_number: number
	errors: number
	answer: number[]
	correct: number
	question: [number, number]
}

export const NumberPad = (props: {
	state: NumberPadState
	setState: Dispatch<SetStateAction<NumberPadState>>
	onSubmit: () => void
}) => {
	const { setState, onSubmit, state } = props

	const submitDisabled: boolean = state.answer.length === 0

	return (
		<Box sx={{ p: 0, width: 'fit-content' }}>
			<div>
				<NumberButton number={1} setState={setState} />
				<NumberButton number={2} setState={setState} />
				<NumberButton number={3} setState={setState} />
			</div>
			<div>
				<NumberButton number={4} setState={setState} />
				<NumberButton number={5} setState={setState} />
				<NumberButton number={6} setState={setState} />
			</div>
			<div>
				<NumberButton number={7} setState={setState} />
				<NumberButton number={8} setState={setState} />
				<NumberButton number={9} setState={setState} />
			</div>
			<div>
				<ClearButton icon={<ClearIcon style={{ color: '#961212' }} />} setState={setState} />
				<NumberButton number={0} setState={setState} />
				<DeleteLastButton
					icon={<ArrowBackIcon style={{ color: '#961212' }} />}
					setState={setState}
				/>
			</div>
			<Box py={2}>
				<Button
					variant='outlined'
					sx={{ width: '100%' }}
					onClick={onSubmit}
					disabled={submitDisabled}
				>
					Submit
				</Button>
			</Box>
		</Box>
	)
}

function NumberButton(props: {
	number: number
	setState: Dispatch<SetStateAction<NumberPadState>>
}) {
	const f = () => {
		props.setState((v) => {
			const state = { ...v }
			state.answer = [...v.answer, props.number]
			return state
		})
	}

	return (
		<Button
			variant='outlined'
			onClick={f}
			sx={{
				borderRadius: '25px',
				minWidth: '65px',
				height: '55px',
				mx: 1.2,
				my: 1.2,
				px: 1,
				py: '3px',
				fontSize: '1.5rem',
			}}
		>
			{props.number}
		</Button>
	)
}

function ClearButton(props: { icon: any; setState: Dispatch<SetStateAction<NumberPadState>> }) {
	const f = () => {
		props.setState((v) => {
			if (v.answer.length === 0) return v
			const state = { ...v }
			state.answer = []
			return state
		})
	}

	return (
		<Button
			variant='outlined'
			onClick={f}
			sx={{ borderRadius: '25px', minWidth: '65px', height: '55px', mx: 1.2, my: 1.2 }}
		>
			{props.icon}
		</Button>
	)
}

function DeleteLastButton(props: {
	icon: any
	setState: Dispatch<SetStateAction<NumberPadState>>
}) {
	const f = () => {
		props.setState((v) => {
			if (v.answer.length === 0) return v
			const state = { ...v }
			const newAnswer = [...v.answer]
			newAnswer.pop()
			state.answer = newAnswer
			return state
		})
	}

	return (
		<Button
			variant='outlined'
			onClick={f}
			sx={{ borderRadius: '25px', minWidth: '65px', height: '55px', mx: 1.2, my: 1.2 }}
		>
			{props.icon}
		</Button>
	)
}

