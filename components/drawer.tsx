import React, { useEffect, useRef } from 'react';

import Portal from '@/HOCs/portal';

interface IDrawer {
	className?: string;
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
}

const Drawer: React.FC<IDrawer> = ({ className, isOpen, setIsOpen, children }) => {
	const ref = useRef<HTMLDivElement>(null);
	// const refBlock = useRef<HTMLDivElement>(null);

	// useEffect(() => {
	// 	const refBlock = document.body;
	// 	if (isOpen) {
	// 		if (refBlock && refBlock) {
	// 			disableBodyScroll(refBlock);
	// 		}
	// 	} else {
	// 		if (refBlock && refBlock) {
	// 			enableBodyScroll(refBlock);
	// 			clearAllBodyScrollLocks();
	// 		}
	// 	}
	// 	return () => clearAllBodyScrollLocks();
	// }, [isOpen]);

	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : 'unset';
		document.body.style.height = isOpen ? '100%' : 'unset';

		if (isOpen) {
			document.body.style.overflow = 'hidden !important';
			var vpH = window.innerHeight;
			// document.documentElement.style.height = vpH.toString() + 'px';
			document.body.style.height = vpH.toString() + 'px';
		}

		return () => {
			document.body.style.overflow = 'unset';
			document.body.style.height = 'unset';
		};
	}, [isOpen]);

	useEffect(() => {
		if (isOpen) {
			const handleClickOutside = (event: any) => {
				if (ref.current && !ref.current.contains(event.target)) {
					setIsOpen(false);
				}
			};
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	}, [ref, isOpen]);

	return (
		<>
			{/* {isOpen ? ( */}
			<Portal>
				<div
					className={`fixed top-0 left-0 z-[97] h-full  w-full transition-all duration-300 ease-in-out !overflow-hidden ${
						isOpen ? 'visible bg-black-60/[.3] opacity-100' : 'invisible opacity-0'
					} ${className || ''}`}
				>
					<div className='fixed h-full top-0 left-0 bg-transparent z-[98]  w-full !overflow-hidden'>
						<div
							className={`absolute w-full overflow-y-hidden bg-white transition-[bottom] duration-300 ease-in-out z-[99] ${
								isOpen ? 'bottom-0 scrollOverflow' : 'bottom-[-300px]'
							}`}
							ref={ref}
						>
							{children}
						</div>
					</div>
				</div>
			</Portal>
			{/* ) : null} */}
		</>
	);
};

export default Drawer;
