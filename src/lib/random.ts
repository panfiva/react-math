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
		const index = Math.floor(Math.random() * len)
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

export type TRandomFn = (/** the number of question to be generated */ question_number: number) => {
	/** pair of generated numbers */
	data: [number, number]
	meta: {
		/** base number that is being generated; if undefined, random numbers are generated */
		base?: number | undefined
		/** indicates if base has changed */
		baseChanged: boolean
	}
}

export const randomPairFactory2 = (props: {
	/** object that controls probability: `{<number>:<weight>}` */
	weights: { [x: number]: number }
	/** array of numbers that will be cycled through as weights */
	baseNumbers: number[]
	/** questions per base */
	perQuestion: number
}) => {
	const { weights, perQuestion } = props

	const baseNumbers = shuffle(props.baseNumbers)

	console.log('baseNumbers:', baseNumbers)
	console.log('per base:', perQuestion)

	const random = randomNumberFactory(weights)
	const randomPair = randomPairFactory(weights)

	type TMeta = { base?: number | undefined; baseChanged: boolean }
	let meta: TMeta = { base: undefined, baseChanged: false }

	const randomPair2 = (
		question: number
	): { data: [/** first number*/ number, /** second number */ number]; meta: TMeta } => {
		// console.debug({ question, len: baseNumbers.length, perQuestion })

		if (question > baseNumbers.length * perQuestion) {
			let newMeta: TMeta
			if (meta.base !== undefined) {
				newMeta = { base: undefined, baseChanged: true }
			} else if (meta.base === undefined && meta.baseChanged === true) {
				newMeta = { base: undefined, baseChanged: false }
			} else {
				newMeta = meta
			}
			meta = newMeta
			return { data: randomPair(), meta }
		} else {
			const idx = Math.floor((question - 1) / perQuestion)
			const a = baseNumbers[idx]
			const b = random()

			let newMeta: TMeta

			if (meta.base !== a) {
				newMeta = { base: a, baseChanged: true }
			} else if (meta.base === a && meta.baseChanged === true) {
				newMeta = { base: a, baseChanged: false }
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

function shuffle(array: number[]) {
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

