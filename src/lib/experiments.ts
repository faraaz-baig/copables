export function getVariant(experimentKey: string): 'A' | 'B' {
	const storageKey = `ab_${experimentKey}`;
	const existing = localStorage.getItem(storageKey);
	if (existing === 'A' || existing === 'B') return existing;

	const variant = Math.random() < 0.5 ? 'A' : 'B';
	localStorage.setItem(storageKey, variant);
	return variant;
}
