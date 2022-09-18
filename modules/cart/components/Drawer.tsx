import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

type Direction = 'LEFT' | 'RIGHT' | 'BOTTOM' | 'TOP';

interface IDrawer {
	className?: string;
	isOpen: boolean;
	setIsOpen?: (value: boolean) => void;
	direction?: Direction;
	height?: string;
}

const Drawer: React.FC<IDrawer> = ({
	className,
	isOpen,
	setIsOpen,
	children,
	direction,
	height,
}) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	useEffect(() => {
		if (isOpen) {
			const handleClickOutside = (event: any) => {
				// if (ref.current && !ref.current.contains(event.target)) {
				// 	setIsOpen(false);
				// }
			};
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	}, [ref, isOpen]);

	return (
		<div
			className={classNames([
				'w-full fixed top-0 bottom-0 left-0 right-0 touch-none transition-all duration-300 ease-in-out',
				isOpen ? 'bg-black-60/[.3] visible opacity-100 z-30' : 'invisible opacity-0 -z-1',
				height ?? ' h-full',
			])}
			// style={{ visibility: 'hidden' }}
		>
			<div
				className={classNames([
					'w-full absolute overflow-y-auto duration-300 z-50 ease-in-out bg-white',
					direction === 'LEFT' && 'transition-[left] -left-[100%]',
					direction === 'RIGHT' && 'transition-[right] -right-[100%]',
					direction === 'BOTTOM' && 'transition-[bottom] -bottom-[100%]',
					direction === 'TOP' && 'transition-[top] -top-[100%]',
					isOpen && direction === 'BOTTOM' && '!bottom-0',
					isOpen && direction === 'LEFT' && '!left-0',
					isOpen && direction === 'RIGHT' && '!right-0',
					isOpen && direction === 'TOP' && '!top-0',
					className,
				])}
				ref={ref}
			>
				{children}
			</div>
		</div>
	);
};

export default Drawer;
