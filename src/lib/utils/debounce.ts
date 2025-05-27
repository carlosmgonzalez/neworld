export function debounce<F extends (...args: unknown[]) => unknown>(
	func: F,
	delay: number
): (...args: Parameters<F>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
		if (timeoutId !== undefined) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}
