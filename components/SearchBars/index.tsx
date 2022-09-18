import { FC } from 'react';

const SearchBar: FC = () => {
	return (
		<div className='flex h-8 items-center'>
			<div className='flex h-8 w-full items-center rounded-4px border border-E3DEDE bg-white px-3 py-2px'>
				<img
					loading='lazy'
					src='/static/svg/search-9f9f9f.svg'
					className='h-13px w-13px'
					alt='search'
				/>
				<input
					placeholder='Tìm thương hiệu'
					className='ml-2 h-7 flex-1 border-none py-2 focus-within:outline-0 focus:outline-0 focus-visible:outline-0'
				/>
			</div>
		</div>
	);
};

export default SearchBar;
