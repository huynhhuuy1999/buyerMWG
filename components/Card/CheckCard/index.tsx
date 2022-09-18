import { MouseEventHandler } from 'react';

interface ICheckCard {
	checked?: boolean;
	className?: string;
	onClick?: MouseEventHandler;
	title?: string;
}

const CheckCard: React.FC<ICheckCard> = ({ title, checked, children, className, onClick }) => {
	return (
		<div
			title={title}
			className={`relative flex h-10 cursor-pointer	 items-center justify-center whitespace-normal break-normal rounded-3px border ${
				checked ? 'border-[#F05A94]' : 'border-light-E0E0E0	'
			} ${className || ''}`}
			onKeyDown={() => {}}
			onClick={onClick}
			tabIndex={0}
			role='button'
		>
			{children}
			{checked && (
				<div className='absolute -top-1px -right-1px'>
					<div className='h-0 w-0 border-t-18px border-l-18px border-t-[#F05A94] border-l-transparent' />
					<img
						src='/static/svg/iconCheck.svg'
						className='absolute top-2px right-2px h-9px w-7px'
						alt=''
					/>
				</div>
			)}
		</div>
	);
};

export default CheckCard;
