import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Dispatch, SetStateAction } from 'react'
import { SxProps, Theme } from '@mui/material'

import ClearIcon from '@mui/icons-material/Clear'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export type NumberPadState = {
	item_number: number
	errors: number
	answer: number[]
	correct: number
	question: [number, number]
	baseChanged: boolean
	base: number | undefined
	last_question: boolean
	completed: boolean
}

export const NumberPad = <T extends { answer: number[] }>(props: {
	state: T
	setState: Dispatch<SetStateAction<T>>
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
					sx={{ width: '100%', minHeight: '55px', borderRadius: 2, boxShadow: 2 }}
					onClick={onSubmit}
					disabled={submitDisabled}
				>
					Submit
				</Button>
			</Box>
		</Box>
	)
}

const ButtonSx: SxProps<Theme> = {
	borderRadius: '25px',
	minWidth: '95px',
	height: '75px',
	mx: 1.2,
	my: 1.2,
	px: 1,
	py: '3px',
	fontSize: '1.5rem',
	boxShadow: 2,
}

function NumberButton<T extends { answer: number[] }>(props: {
	number: number
	setState: Dispatch<SetStateAction<T>>
}) {
	const f = () => {
		props.setState((v) => {
			const state = { ...v }
			state.answer = [...v.answer, props.number]
			return state
		})
	}

	return (
		<Button variant='outlined' onClick={f} sx={ButtonSx}>
			{props.number}
		</Button>
	)
}

function ClearButton<T extends { answer: number[] }>(props: {
	icon: any
	setState: Dispatch<SetStateAction<T>>
}) {
	const f = () => {
		props.setState((v) => {
			if (v.answer.length === 0) return v
			const state = { ...v }
			state.answer = []
			return state
		})
	}

	return (
		<Button variant='outlined' onClick={f} sx={ButtonSx}>
			{props.icon}
		</Button>
	)
}

function DeleteLastButton<T extends { answer: number[] }>(props: {
	icon: any
	setState: Dispatch<SetStateAction<T>>
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
		<Button variant='outlined' onClick={f} sx={ButtonSx}>
			{props.icon}
		</Button>
	)
}

