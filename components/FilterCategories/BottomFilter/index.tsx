import React, { MouseEventHandler } from 'react';

export interface IBottomFilter {
	handleCancel?: MouseEventHandler;
	handleSearch?: MouseEventHandler;
	loading?: boolean;
	count?: number;
}

const BottomFilter: React.FC<IBottomFilter> = ({ handleCancel, handleSearch, loading, count }) => {
	return (
		<div className='flex h-16 items-center justify-end bg-F8F8F8 py-3 px-4'>
			<button
				className='h-10 w-157px rounded-3px border border-EA001B font-sfpro text-16 text-EA001B'
				onClick={handleCancel}
			>
				Bỏ chọn
			</button>
			<button
				className={`ml-10px h-10 w-157px rounded-3px bg-[#F05A94] text-white ${
					count === 0 || !count ? 'cursor-not-allowed bg-[#F05A94]/50' : ''
				}`}
				onClick={handleSearch}
				disabled={!count || count === 0}
			>
				{loading ? (
					// <Spin />
					<div className='flex w-full justify-center'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 4335 4335'
							width={24}
							height={24}
							className='animate-spin'
						>
							<path
								fill='#FFFFFF'
								d='M3346 1077c41,0 75,34 75,75 0,41 -34,75 -75,75 -41,0 -75,-34 -75,-75 0,-41 34,-75 75,-75zm-1198 -824c193,0 349,156 349,349 0,193 -156,349 -349,349 -193,0 -349,-156 -349,-349 0,-193 156,-349 349,-349zm-1116 546c151,0 274,123 274,274 0,151 -123,274 -274,274 -151,0 -274,-123 -274,-274 0,-151 123,-274 274,-274zm-500 1189c134,0 243,109 243,243 0,134 -109,243 -243,243 -134,0 -243,-109 -243,-243 0,-134 109,-243 243,-243zm500 1223c121,0 218,98 218,218 0,121 -98,218 -218,218 -121,0 -218,-98 -218,-218 0,-121 98,-218 218,-218zm1116 434c110,0 200,89 200,200 0,110 -89,200 -200,200 -110,0 -200,-89 -200,-200 0,-110 89,-200 200,-200zm1145 -434c81,0 147,66 147,147 0,81 -66,147 -147,147 -81,0 -147,-66 -147,-147 0,-81 66,-147 147,-147zm459 -1098c65,0 119,53 119,119 0,65 -53,119 -119,119 -65,0 -119,-53 -119,-119 0,-65 53,-119 119,-119z'
							/>
						</svg>
					</div>
				) : (
					<span>
						Xem <span className={`font-sfpro_semiBold`}>{count}</span> kết quả
					</span>
				)}
			</button>
		</div>
	);
};
export default BottomFilter;
