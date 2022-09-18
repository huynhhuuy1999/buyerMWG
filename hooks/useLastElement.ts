import { MutableRefObject, useCallback, useRef } from 'react';

export const useLastElement = (
	isLoading: boolean,
	condition: any,
	func: (value: IntersectionObserverEntry[]) => any,
) => {
	const observer: MutableRefObject<any> = useRef();
	const lastElementRef = useCallback(
		(node) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries?.[0]?.isIntersecting && condition) {
					func(entries);
				}
			});

			if (node) observer?.current?.observe(node);
		},
		[isLoading, condition],
	);
	return { lastElementRef };
};
