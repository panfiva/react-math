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

export const randomPairFactory2 = (conf: { [x: number]: number }) => {
	const random = randomNumberFactory(conf)
	const randomPair = randomPairFactory(conf)

	const randomPair2 = (question: number): [number, number] => {
		const selection = [4, 6, 7, 8, 9]
		const perQuestion = 15

		if (question > selection.length * perQuestion) return randomPair()

		const idx = Math.floor((question - 1) / perQuestion)
		const a = selection[idx]
		const b = random()
		return a > b ? [a, b] : [b, a]
	}

	return randomPair2
}

export type Operators = 'x' | '*' | '+'

export const checkAnswer = (operator: Operators, a: number, b: number, c: number) => {
	if (operator === 'x' || operator === '*') return a * b === c
	else return a + b === c
}

