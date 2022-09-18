import React, { useEffect, useRef } from 'react';

const BackToTop = () => {
	const backTopEl: any = useRef();

	useEffect(() => {
		backTopEl.current = global?.window?.document?.getElementById('back-to-top');
	}, []);

	global?.window?.addEventListener('scroll', () => {
		if (global?.window?.scrollY > 400) {
			backTopEl?.current?.classList?.add('flex');
			backTopEl?.current?.classList?.remove('hidden');
		} else {
			backTopEl?.current?.classList?.remove('flex');
			backTopEl?.current?.classList?.add('hidden');
		}
	});

	const onClickBackToTop = () => {
		global?.window?.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<button
			id='back-to-top'
			className='fixed bottom-[74px] md:bottom-16 right-5 z-[50] hidden justify-around rounded-full pt-5px opacity-90 hover:opacity-100'
			onClick={() => onClickBackToTop()}
		>
			<img
				src='/static/svg/backtotop.svg'
				alt=''
				className=' rounded-full object-cover h-[35px] w-[35px] md:h-[42px] md:w-[50px]'
			/>
		</button>
	);
};

export default BackToTop;
