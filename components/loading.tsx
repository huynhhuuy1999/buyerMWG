import React from 'react';

const LoadingDots: React.FC<any> = () => {
	return (
		<div className='flex items-center gap-4'>
			<div className='text-[14px] pr-2'>Đang tải</div> <div className='dot-falling'></div>
		</div>
	);
};

export default LoadingDots;
