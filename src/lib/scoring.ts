export type AnswerValue = string | number;

export interface QuizAnswers {
	[key: string]: AnswerValue;
}

export function getRecommendation(answers: QuizAnswers): string {
	// Placeholder scoring logic for IBS quiz
	// Map answers to a product handle
	const severity = answers['severity'] as string;
	const duration = answers['duration'] as string;

	if (severity === 'severe' || duration === 'chronic') {
		return 'ibs-pro';
	}
	if (severity === 'moderate') {
		return 'ibs-core';
	}
	return 'ibs-starter';
}
