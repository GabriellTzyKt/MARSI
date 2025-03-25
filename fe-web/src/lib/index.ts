// place files you want to import through the `$lib` alias in this folder.
import { goto } from '$app/navigation';
import { page } from '$app/state';

export function mutateQueryParams(param: string, callback: (args: string) => string) {
	const searchParams = new URLSearchParams(page.url.searchParams);
	const value = searchParams.get(param) ?? '';

	const new_value = callback(value);
	searchParams.set(param, new_value);

	goto(`?${searchParams.toString()}`);

	return new_value;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const debounce = (callback: Function, wait = 300) => {
	let timeout: ReturnType<typeof setTimeout>;

	return (...args: unknown[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => callback(...args), wait);
	};
};