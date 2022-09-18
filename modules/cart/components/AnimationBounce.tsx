import { CSSProperties } from 'react';

interface AnimationBounceProps {
	color?: CSSProperties['color'];
}

const AnimationLoadingBounce: React.FC<AnimationBounceProps> = ({ color }) => {
	return (
		<div className='flex items-center justify-center gap-2'>
			<div
				className='one-bounce h-1  w-1 animate-bounce rounded-full p-1'
				style={{ backgroundColor: color ?? '#ffffff' }}
			></div>
			<div
				className='two-bounce h-1 w-1 animate-bounce rounded-full p-1'
				style={{ backgroundColor: color ?? '#ffffff' }}
			></div>
			<div
				className='three-bounce h-1  w-1 animate-bounce rounded-full p-1'
				style={{ backgroundColor: color ?? '#ffffff' }}
			></div>
		</div>
	);
};

export default AnimationLoadingBounce;
