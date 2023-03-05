import { isEqual } from 'lodash'

const randomNumbersAr = (conf: { [x: number]: number }) => {
	let ar: number[] = []
	Object.keys(conf).forEach((n) => {
		const num = Number(n)
		const w = conf[num]
		const values = Array(w).fill(num)
		ar = [...ar, ...values]
	})
	return ar
}

export const randomNumberFactory = (conf: { [x: number]: number }) => {
	const ar = randomNumbersAr(conf)
	const len = ar.length

	return () => {
		const r = Math.random()
		const index = Math.floor(r * len)
		return ar[index]
	}
}

export const randomPairFactory = (conf: { [x: number]: number }) => {
	const random = randomNumberFactory(conf)

	const randomPair = (): [a: number, b: number] => {
		const a = random()
		const b = random()
		return a > b ? [a, b] : [b, a]
	}

	return randomPair
}

type TMeta = {
	/** base number that is being generated; if undefined, random numbers are generated */
	base?: number | undefined
	/** indicates if base has changed */
	baseChanged: boolean
	/** indicates if the question is a final question */
	last_question: boolean
	/** indicates if final question was asked */
	completed: boolean
}

export type TRandomFn = (
	/** the number of question to be generated */ question_number: number,
	options?: {
		/** previous answer; if provided, will try to generate a pair different from previous one */
		previousPair?: [number, number]
	}
) => {
	/** pair of generated numbers */
	data: [number, number]
	meta: TMeta
}

/** factory function
 * Creates randomly picks a base number from `baseNumbers` and randomly ads another number based on provided `weights`;
 * Each number generates `perQuestion` number of questions.
 */
export const randomPairFactory_pickBase = (props: {
	/** object that controls probability: `{<number>:<weight>}` */
	weights: { [x: number]: number }
	/** array of numbers that will be cycled through as weights */
	baseNumbers: number[]
	/** questions per base */
	perQuestion: number
	randomize_base: boolean
}): TRandomFn => {
	const { weights, perQuestion, randomize_base } = props

	const baseNumbers = randomize_base ? shuffle([...props.baseNumbers]) : props.baseNumbers

	const random = randomNumberFactory(weights)

	let meta: TMeta = { base: undefined, baseChanged: false, last_question: false, completed: false }

	const randomPair2: TRandomFn = (question, options) => {
		const previous = options?.previousPair

		const last_question = question === baseNumbers.length * perQuestion

		if (question > baseNumbers.length * perQuestion) {
			const newMeta: TMeta = { ...meta, last_question, completed: true }
			meta = newMeta
			return { data: [0, 0], meta: newMeta }
		} else {
			const idx = Math.floor((question - 1) / perQuestion)
			const a = baseNumbers[idx]
			let b = random()

			if (previous) {
				let n: number = 1
				while (isEqual([a, b].sort(), previous.sort()) && n <= 5) {
					console.log('TRY')
					b = random()
					n++
				}
			}

			let newMeta: TMeta

			if (meta.base !== a) {
				newMeta = { base: a, baseChanged: true, last_question, completed: false }
			} else if (meta.base === a && meta.baseChanged === true) {
				newMeta = { base: a, baseChanged: false, last_question, completed: false }
			} else {
				newMeta = meta
			}
			meta = newMeta

			const pair: [number, number] = a > b ? [a, b] : [b, a]

			return { data: pair, meta }
		}
	}

	return randomPair2
}

export type Operators = 'x' | '*' | '+'

export const checkAnswer = (operator: Operators, a: number, b: number, c: number) => {
	if (operator === 'x' || operator === '*') return a * b === c
	else return a + b === c
}

export function shuffle(array: number[]) {
	let currentIndex = array.length,
		randomIndex

	// While there remain elements to shuffle.
	while (currentIndex !== 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--

		// And swap it with the current element.
		;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
	}

	return array
}

