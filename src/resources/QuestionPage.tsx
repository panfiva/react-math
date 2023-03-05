import Box from '@mui/material/Box'
import { Fragment, useState, useEffect, useRef } from 'react'
import { SafeTitle } from '../lib/SafeTitle'
import { useNotify, useDataProvider } from 'react-admin'
import { useQuery } from 'react-query'
import { Operators, checkAnswer, TRandomFn } from '../lib/random'

import { NumberPad, NumberPadState } from '../lib/NumberPad'

type QuestionPageProps = {
	operator: Operators
	titleFn: string | ((props: NumberPadState) => string)
	randomFnFactory: () => TRandomFn
}

function consoleGroup(operator: Operators, newState: NumberPadState) {
	return `question #${newState.item_number}: ${newState.question[0]} ${operator} ${newState.question[1]}, errors: ${newState.errors}, base: ${newState.base}`
}

export const QuestionPage = (props: QuestionPageProps) => {
	const { operator, titleFn, randomFnFactory } = props
	const notify = useNotify()
	const dataProvider = useDataProvider()
	const { data: refreshDate } = useQuery([''], () => dataProvider.getCurrentDate(), {
		cacheTime: 3600000,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	})

	const loadDateRef = useRef<number>(0)

	const randomPairRef = useRef<TRandomFn>(undefined as any)
	if (randomPairRef.current === undefined) {
		console.groupEnd() // close group if we have one open from a previous component
		console.clear()
		randomPairRef.current = randomFnFactory()
	}

	const [state, setState] = useState<NumberPadState>(() => {
		let firstQuestion = randomPairRef.current(1)

		const newState: NumberPadState = {
			answer: [],
			errors: 0,
			item_number: 1,
			correct: 0,
			question: firstQuestion.data,
			baseChanged: firstQuestion.meta.baseChanged,
			base: firstQuestion.meta.base,
			completed: false,
			last_question: false,
		}

		console.group(consoleGroup(operator, newState))

		return newState
	})

	useEffect(() => {
		return () => {
			console.groupEnd() // close console group on unmount
		}
	}, [])

	// NOTIFY BASE CHANGE
	useEffect(() => {
		if (state.baseChanged) {
			notify(`Base number: ${state.base ?? 'random'}`)
		}
	}, [state.baseChanged, state.base, notify, refreshDate])

	// REFRESH BUTTON CLICK
	useEffect(() => {
		if (refreshDate === undefined) return

		if (loadDateRef.current !== 0 && loadDateRef.current !== refreshDate) {
			loadDateRef.current = refreshDate

			console.groupEnd()
			console.clear()

			randomPairRef.current = randomFnFactory() // change order or random bases

			const firstQuestion = randomPairRef.current(1) // set first question using current random pair

			const newState: NumberPadState = {
				answer: [],
				errors: 0,
				item_number: 1,
				correct: 0,
				question: firstQuestion.data,
				baseChanged: true,
				base: firstQuestion.meta.base,
				completed: false,
				last_question: false,
			}

			console.group(consoleGroup(operator, newState))

			setState(newState)
		}
		if (loadDateRef.current === 0) {
			loadDateRef.current = refreshDate
		}
	}, [refreshDate, operator, randomFnFactory])

	const onSubmit = () => {
		setState((v) => {
			const submittedAnswer = Number(v.answer.join(''))
			const isCorrect = checkAnswer(operator, v.question[0], v.question[1], submittedAnswer)

			if (isCorrect) {
				const newState: NumberPadState = { ...v }
				let newQuestion = randomPairRef.current(newState.item_number + 1, {
					previousPair: v.question,
				})
				newState.item_number++
				newState.correct++
				newState.question = newQuestion.data
				newState.baseChanged = newQuestion.meta.baseChanged
				newState.base = newQuestion.meta.base
				newState.answer = []
				newState.last_question = newQuestion.meta.last_question
				newState.completed = newQuestion.meta.completed
				console.groupEnd()
				console.group(consoleGroup(operator, newState))

				return newState
			} else {
				const newState: NumberPadState = { ...v }
				newState.answer = []
				newState.errors++

				console.log(`wrong answer: ${submittedAnswer}`)

				notify(`Incorrect answer: ${v.answer.join('')}`, { type: 'error', autoHideDuration: 3000 })
				return newState
			}
		})
	}

	const title: string = typeof titleFn === 'function' ? titleFn(state) : titleFn

	if (state.completed === true)
		return (
			<Fragment>
				<Box sx={{ p: 1 }}>
					<Box sx={{ p: 1, fontSize: '1.2rem', display: 'flex', width: '100%' }}>
						<Box mr={1} px={1} sx={{ flexGrow: 1, boxShadow: 2 }}>
							Answers: {state.item_number - 1}
						</Box>
						<Box mr={1} px={1} sx={{ flexGrow: 1, boxShadow: 2 }}>
							Errors: {state.errors}
						</Box>
						<Box px={1} sx={{ flexGrow: 1, boxShadow: 2 }}>
							Score: {state.correct - state.errors}
						</Box>
					</Box>
					<Box sx={{ py: 1, px: 2, fontSize: '1.5rem', boxShadow: 4, m: 1 }}>
						{state.answer.join(', ') || (
							<Box sx={{ color: 'grey', fontStyle: 'italic' }}>Complete</Box>
						)}
					</Box>
				</Box>
			</Fragment>
		)
	else
		return (
			<Fragment>
				<SafeTitle title={title} />

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
					<Fragment>
						<Box sx={{ p: 2, height: '80px', fontSize: '1.5rem' }}>
							{state.question[0]} {operator} {state.question[1]} = {state.answer}
						</Box>
						<NumberPad state={state} setState={setState} onSubmit={onSubmit} />
					</Fragment>
				</Box>
			</Fragment>
		)
}

