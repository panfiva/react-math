import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Fragment, useState, Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { SafeTitle } from '../../lib/SafeTitle'
import { useNotify, useDataProvider } from 'react-admin'
import { useQuery } from 'react-query'

import ClearIcon from '@mui/icons-material/Clear'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

type State = {
	item_number: number
	errors: number
	answer: number[]
	correct: number
	question: [number, number]
}

/** key is number, value is weight */
const weights = { 2: 5, 3: 12, 4: 15, 5: 12, 6: 16, 7: 16, 8: 16, 9: 16 }

const randomNumbersAr = (conf: { [x: number]: number }) => {
	let ar: number[] = []
	Object.keys(conf).forEach((n: any) => {
		const w = conf[n]
		const values = Array(w).fill(n)
		ar = [...ar, ...values]
	})
	return ar
}

const randomNumberFactory = (conf: { [x: number]: number }) => {
	const ar = randomNumbersAr(conf)
	const len = ar.length

	return () => {
		const index = Math.floor(Math.random() * len)
		return ar[index]
	}
}

const random = randomNumberFactory(weights)

const randomPair = (): [a: number, b: number] => {
	const a = random()
	const b = random()
	return a > b ? [a, b] : [b, a]
}

const randomPair2 = (question: number): [number, number] => {
	const selection = [4, 6, 7, 8, 9]
	const perQuestion = 15

	if (question > selection.length * perQuestion) return randomPair()

	const idx = Math.floor((question - 1) / perQuestion)
	const a = selection[idx]
	const b = random()
	return a > b ? [a, b] : [b, a]
}

const firstQuestion = randomPair2(1)

export const Multiplication = () => {
	const notify = useNotify()
	const dataProvider = useDataProvider()
	const { data: refreshDate } = useQuery([''], () => dataProvider.getCurrentDate())

	const loadDateRef = useRef<number>(0)

	const [state, setState] = useState<State>({
		answer: [],
		errors: 0,
		item_number: 1,
		correct: 0,
		question: firstQuestion,
	})

	useEffect(() => {
		if (refreshDate === undefined) return

		if (loadDateRef.current !== 0 && loadDateRef.current !== refreshDate) {
			loadDateRef.current = refreshDate
			setState({
				answer: [],
				errors: 0,
				item_number: 1,
				correct: 0,
				question: randomPair2(1),
			})
		}
		if (loadDateRef.current === 0) {
			loadDateRef.current = refreshDate
		}
	}, [refreshDate])

	const onSubmit = () => {
		setState((v) => {
			const correctAnswer = v.question[0] * v.question[1]
			const submittedAnswer = Number(v.answer.join(''))

			if (correctAnswer === submittedAnswer) {
				const newState = { ...state }
				newState.answer = []
				newState.item_number++
				newState.correct++
				newState.question = randomPair2(newState.item_number)
				return newState
			} else {
				const newState = { ...state }
				newState.answer = []
				newState.errors++
				notify(`Incorrect answer: ${v.answer.join('')}`, { type: 'error', autoHideDuration: 3000 })
				return newState
			}
		})
	}

	return (
		<Fragment>
			<SafeTitle title='Multiplication' />

			<Box sx={{ p: 1 }}>
				<Box sx={{ p: 2, fontSize: '1.2rem', display: 'flex', width: '100%' }}>
					<Box mr={1} px={1} sx={{ flexGrow: 1, boxShadow: 2 }}>
						Question: {state.item_number}
					</Box>
					<Box mr={1} px={1} sx={{ flexGrow: 1, boxShadow: 2 }}>
						Errors: {state.errors}
					</Box>
					<Box px={1} sx={{ flexGrow: 1, boxShadow: 2 }}>
						Score: {state.correct - state.errors}
					</Box>
				</Box>
				<Box sx={{ p: 2, height: '80px', fontSize: '1.5rem' }}>
					{state.question[0]} x {state.question[1]} = {state.answer}
				</Box>
				<NumberPad state={state} setState={setState} onSubmit={onSubmit} />
			</Box>
		</Fragment>
	)
}

export const NumberPad = (props: {
	state: State
	setState: Dispatch<SetStateAction<State>>
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
				</Button>{' '}
			</Box>
		</Box>
	)
}

function NumberButton(props: { number: number; setState: Dispatch<SetStateAction<State>> }) {
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

function ClearButton(props: { icon: any; setState: Dispatch<SetStateAction<State>> }) {
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

function DeleteLastButton(props: { icon: any; setState: Dispatch<SetStateAction<State>> }) {
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

