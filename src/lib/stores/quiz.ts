import { writable } from 'svelte/store';
import type { QuizAnswers } from '$lib/scoring';

function createQuizStore() {
	const { subscribe, set, update } = writable<QuizAnswers>({});

	return {
		subscribe,
		setAnswer: (key: string, value: string | number) =>
			update((answers) => ({ ...answers, [key]: value })),
		reset: () => set({})
	};
}

export const quizAnswers = createQuizStore();
