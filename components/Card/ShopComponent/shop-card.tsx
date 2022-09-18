import { ImageCustom } from 'components';
import { IMerchantSearch } from 'models';
import { useRouter } from 'next/router';

interface IShopCart {
	className?: string;
	data?: IMerchantSearch;
}

const ShopCard: React.FC<IShopCart> = ({ className, data }) => {
	const route = useRouter();
	return (
		<div
			className={`mt-7 px-2 flex sm:flex-row flex-col justify-center border border-E7E7E8 h-32
			w-[calc(calc(100%_/_3)_-_8px)]
			${className || ''}`}
		>
			<div className='flex w-full items-center'>
				<div className='relative aspect-square h-28  rounded-full'>
					<ImageCustom
						src={`${data?.value}`}
						alt=''
						layout='fill'
						objectFit='contain'
						className='rounded-full'
						priority
					/>
				</div>
				<div className='flex grow flex-col sm:ml-3'>
					<p className='w-40 text-ellipsis whitespace-nowrap font-sfpro_bold text-20 overflow-x-hidden '>
						{data?.name}
					</p>
					<div className='relative flex items-center text-16 text-black-60'>
						<ImageCustom
							src='/static/svg/star-product.svg'
							width={'19px'}
							height={'19px'}
							alt=''
							priority
						/>
						<p className='mr-2 '>
							{Number(data?.averageRating || 0)} ({Number(data?.totalRating || 0)})
						</p>
						<div className='flex items-center bg-[#009ADA]/[.08] px-3px py-1px'>
							<ImageCustom
								src={'/static/svg/iconLogoYellow.svg'}
								alt=''
								width={20}
								height={20}
								priority
							/>
							<span className='ml-2px text-[#126BFB]'>Đảm bảo</span>
						</div>
					</div>
					<p
						role='none'
						className='mt-4 cursor-pointer font-sfpro_semiBold text-16 leading-6 text-[#126BFB]'
						onClick={() => route.push(`/${data?.portalLink}`)}
						tabIndex={0}
					>
						Xem chi tiết shop
					</p>
				</div>
			</div>
		</div>
	);
};

export default ShopCard;
