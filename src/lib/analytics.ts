export const track = (eventName: string, properties: Record<string, any> = {}) => {
	const payload = { ...properties, timestamp: Date.now() };

	// PostHog
	if (typeof window !== 'undefined' && (window as any).posthog) {
		(window as any).posthog.capture(eventName, payload);
	}

	// GTM dataLayer -> GA4
	if (typeof window !== 'undefined') {
		(window as any).dataLayer = (window as any).dataLayer || [];
		(window as any).dataLayer.push({ event: eventName, ...payload });
	}
};
