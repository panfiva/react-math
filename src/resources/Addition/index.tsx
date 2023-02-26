import Box from '@mui/material/Box'
import { Fragment, useState, useEffect, useRef } from 'react'
import { SafeTitle } from '../../lib/SafeTitle'
import { useNotify, useDataProvider } from 'react-admin'
import { useQuery } from 'react-query'
import { randomPairFactory2, Operators, checkAnswer } from '../../lib/random'

import { NumberPad, NumberPadState } from '../../lib/NumberPad'

/** key is number, value is weight */
const weights = { 2: 5, 3: 12, 4: 15, 5: 12, 6: 16, 7: 16, 8: 16, 9: 16 }
let { fn: randomPair, perQuestion, baseNumbers } = randomPairFactory2(weights)
let firstQuestion = randomPair(1)

const OPERATOR: Operators = `+`

export const Addition = () => {
	const notify = useNotify()
	const dataProvider = useDataProvider()
	const { data: refreshDate } = useQuery([''], () => dataProvider.getCurrentDate(), {
		cacheTime: 3600000,
		refetchOnWindowFocus: false,
	})

	const loadDateRef = useRef<number>(0)

	const [state, setState] = useState<NumberPadState>({
		answer: [],
		errors: 0,
		item_number: 1,
		correct: 0,
		question: firstQuestion,
	})

	useEffect(() => {
		if (
			state.item_number <= baseNumbers.length * perQuestion &&
			(state.item_number - 1) % perQuestion === 0
		) {
			const idx = Math.floor((state.item_number - 1) / perQuestion)
			const base = baseNumbers[idx]
			notify(`Base number: ${base}`)
		}
	}, [state.item_number, notify, refreshDate])

	useEffect(() => {
		if (refreshDate === undefined) return

		if (loadDateRef.current !== 0 && loadDateRef.current !== refreshDate) {
			loadDateRef.current = refreshDate

			const {
				fn,
				perQuestion: v_perQuestion,
				baseNumbers: v_baseNumbers,
			} = randomPairFactory2(weights) // change order or random bases
			randomPair = fn
			perQuestion = v_perQuestion
			baseNumbers = v_baseNumbers
			firstQuestion = randomPair(1) // set first question using current random pair

			setState({
				answer: [],
				errors: 0,
				item_number: 1,
				correct: 0,
				question: randomPair(1),
			})
		}
		if (loadDateRef.current === 0) {
			loadDateRef.current = refreshDate
		}
	}, [refreshDate])

	const onSubmit = () => {
		setState((v) => {
			const submittedAnswer = Number(v.answer.join(''))
			const isCorrect = checkAnswer(OPERATOR, v.question[0], v.question[1], submittedAnswer)

			if (isCorrect) {
				const newState = { ...state }
				newState.answer = []
				newState.item_number++
				newState.correct++
				newState.question = randomPair(newState.item_number)
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
			<SafeTitle title='Addition' />

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
					{state.question[0]} {OPERATOR} {state.question[1]} = {state.answer}
				</Box>
				<NumberPad state={state} setState={setState} onSubmit={onSubmit} />
			</Box>
		</Fragment>
	)
}

