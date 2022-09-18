import classNames from 'classnames';
import React from 'react';

interface ITagProps {
	value?: any;
	title: string;
	color?: string;
	onRemove?: (value: any) => void;
	onClick?: (value: any) => void;
	onMouseDown?: (value: any) => void;
	fitText?: boolean;
	round?: boolean;
	gap?: number;
	className?: string;
}

const Tag: React.FC<ITagProps> = ({
	title,
	color,
	value,
	onClick,
	onRemove,
	onMouseDown,
	fitText,
	round,
	gap,
	className,
}: ITagProps) => {
	return (
		<div className='relative cursor-pointer mb-[8px]'>
			{onRemove && (
				<div
					onMouseDown={() => onRemove?.(value)}
					onKeyDown={() => onRemove?.(value)}
					role='button'
					tabIndex={0}
					className='absolute top-[-10px] right-[-8px] rounded-full bg-gray-400 p-1'
				>
					<svg
						className='mr-0 h-3 w-3 text-white'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						strokeWidth='2'
						stroke='currentColor'
						fill='none'
						strokeLinecap='round'
						strokeLinejoin='round'
					>
						<path stroke='none' d='M0 0h24v24H0z' />
						<line x1='18' y1='6' x2='6' y2='18' />
						<line x1='6' y1='6' x2='18' y2='18' />
					</svg>
				</div>
			)}
			<div
				key={value}
				className={classNames(
					'm- px-2 py-1',
					!!gap ? gap : '2',
					!!color || 'bg-gray-200',
					!!round && 'rounded-sm',
				)}
				style={{ width: fitText ? 'max-content' : '' }}
				onClick={() => onClick?.(value)}
				onKeyDown={() => onClick?.(value)}
				role='button'
				tabIndex={0}
				onMouseDown={() => onMouseDown?.(value)}
			>
				<span className={classNames(className && className + 'text-black font-medium text-sm')}>
					{title}
				</span>
			</div>
		</div>
	);
};

export default Tag;
