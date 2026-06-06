<script lang="ts">
	import { quizAnswers } from '$lib/stores/quiz';
	import { getRecommendation } from '$lib/scoring';
	import { track } from '$lib/analytics';
	import QuizStep from './QuizStep.svelte';

	interface Question {
		key: string;
		question: string;
		options: { value: string; label: string }[];
	}

	interface Props {
		questions: Question[];
		shopifyDomain: string;
		category: string;
	}

	let { questions, shopifyDomain, category }: Props = $props();

	let currentIndex = $state(0);
	let completed = $state(false);

	let totalSteps = $derived(questions.length);
	let progress = $derived(totalSteps > 0 ? ((currentIndex + 1) / totalSteps) * 100 : 0);

	function handleAnswer(value: string) {
		quizAnswers.setAnswer(questions[currentIndex].key, value);
		if (currentIndex < totalSteps - 1) {
			currentIndex += 1;
		} else {
			finishQuiz();
		}
	}

	function finishQuiz() {
		completed = true;
		const answers: Record<string, string | number> = {};
		const unsubscribe = quizAnswers.subscribe((a) => {
			Object.assign(answers, a);
		});
		unsubscribe();

		const handle = getRecommendation(answers);
		track('quiz_completed', { score: 0, recommended: handle, category });
		track('shopify_redirect', { productHandle: handle, source: 'quiz' });

		window.location.href = `https://${shopifyDomain}/products/${handle}`;
	}

	$effect(() => {
		track('quiz_started', { category });
	});
</script>

<div class="quiz-flow">
	{#if !completed}
		<div class="progress-bar">
			<div class="progress" style="width: {progress}%"></div>
		</div>
		<QuizStep
			question={questions[currentIndex].question}
			name={questions[currentIndex].key}
			options={questions[currentIndex].options}
			onAnswer={handleAnswer}
		/>
	{:else}
		<p>Finding your recommendation...</p>
	{/if}
</div>

<style>
	.quiz-flow {
		padding: 2rem 1rem;
	}
	.progress-bar {
		width: 100%;
		max-width: 600px;
		height: 8px;
		background: #eee;
		border-radius: 4px;
		margin: 0 auto 2rem;
		overflow: hidden;
	}
	.progress {
		height: 100%;
		background: #111;
		transition: width 0.3s ease;
	}
</style>
