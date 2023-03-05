import Box from '@mui/material/Box'
import { Fragment, useState, useEffect, useRef } from 'react'
import { SafeTitle } from '../lib/SafeTitle'
import { useDataProvider } from 'react-admin'
import { useQuery } from 'react-query'
import { Operators, randomPairFactory_pickBase, TRandomFn, shuffle } from '../lib/random'
import { QuestionPage } from './QuestionPage'
import { NumberPad } from '../lib/NumberPad'

type SelectBaseQuestionPageProps = {
	operator: Operators
	title: string
	/** object that controls probability: `{<number>:<weight>}` */
	weights: Record<number, number>
	/** questions per base */
	perQuestion: number
	starting_base: number[]
}

type SelectBaseQuestionPageState = {
	/** base was selected so QA page is displayed */
	started: boolean
	/** numbers entered on number pad; these are numbers for the base */
	answer: number[]
	random?: () => TRandomFn
}

export const SelectBaseQuestionPage = (props: SelectBaseQuestionPageProps) => {
	const { operator, title, weights, perQuestion, starting_base } = props
	const dataProvider = useDataProvider()
	const { data: refreshDate } = useQuery([''], () => dataProvider.getCurrentDate(), {
		cacheTime: 3600000,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	})

	const loadDateRef = useRef<number>(0)

	const [state, setState] = useState<SelectBaseQuestionPageState>({
		started: false,
		answer: starting_base,
		random: undefined,
	})

	useEffect(() => {
		return () => {
			console.groupEnd() // close console group on unmount
		}
	}, [])

	// REFRESH BUTTON CLICK
	useEffect(() => {
		console.log('refresh', loadDateRef.current, refreshDate)

		if (refreshDate === undefined) return

		if (loadDateRef.current !== 0 && loadDateRef.current !== refreshDate) {
			loadDateRef.current = refreshDate

			console.groupEnd()
			console.clear()

			setState({ started: false, answer: shuffle([4, 6, 7, 8, 9]).slice(0, 3), random: undefined })
		}
		if (loadDateRef.current === 0) {
			loadDateRef.current = refreshDate
		}
	}, [refreshDate])

	const onSubmit = () => {
		setState((v) => {
			const randomFn = randomPairFactory_pickBase({
				baseNumbers: state.answer,
				perQuestion,
				weights,
				randomize_base: false,
			})

			const newState: SelectBaseQuestionPageState = {
				answer: v.answer,
				started: true,
				random: () => randomFn,
			}
			return newState
		})
	}

	if (state.started === true) {
		return (
			<Fragment>
				<QuestionPage operator={operator} titleFn={title} randomFnFactory={state.random!} />
			</Fragment>
		)
	} else {
		return (
			<Fragment>
				<SafeTitle title={title} />

				<Box sx={{ p: 1 }}>
					<Box sx={{ py: 1, px: 2, fontSize: '1.5rem', boxShadow: 4, m: 1 }}>
						{state.answer.join(', ') || (
							<Box sx={{ color: 'grey', fontStyle: 'italic' }}>Enter base numbers</Box>
						)}
					</Box>
					<NumberPad setState={setState} state={state} onSubmit={onSubmit} />
				</Box>
			</Fragment>
		)
	}
}

