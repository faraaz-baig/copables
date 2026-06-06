<script lang="ts">
	import { track } from '$lib/analytics';

	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		question: string;
		name: string;
		options: Option[];
		onAnswer: (value: string) => void;
	}

	let { question, name, options, onAnswer }: Props = $props();

	function handleSelect(value: string) {
		track('quiz_answer', { question: name, answer: value });
		onAnswer(value);
	}
</script>

<div class="quiz-step">
	<h2>{question}</h2>
	<div class="options">
		{#each options as option}
			<button type="button" onclick={() => handleSelect(option.value)}>
				{option.label}
			</button>
		{/each}
	</div>
</div>

<style>
	.quiz-step {
		max-width: 600px;
		margin: 0 auto;
		text-align: center;
	}
	.quiz-step h2 {
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
	}
	.options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.options button {
		padding: 1rem;
		font-size: 1rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		background: #fff;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s;
	}
	.options button:hover {
		background: #f5f5f5;
		border-color: #bbb;
	}
</style>
