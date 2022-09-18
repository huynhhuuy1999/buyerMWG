import classNames from 'classnames';
import { ImageCustom } from 'components';
import { MODE_RUNNER } from 'enums';
import { IProductDetailProps, MerchantChat } from 'models';
import Link from 'next/link';
import { Icon, IconEnum } from 'vuivui-icons';

import { useAppChat } from '@/hooks/useAppChat';

const SellerInformation = ({
	productDetails,
	ratingStar,
	mode,
	infoMerchant,
}: IProductDetailProps) => {
	const payload: MerchantChat = {
		userId: productDetails.merchant.userId,
		name: productDetails.merchant.name,
		fullPath: productDetails?.merchant?.avatarImage,
		brandId: productDetails.brandId.toString(),
	};
	const { onHandleOpenChat } = useAppChat();
	const handleOpenChat = () => {
		onHandleOpenChat(payload);
	};
	return (
		<div className='relative mt-4'>
			<div className='pb-3 font-sfpro_bold text-20 font-bold uppercase'>Thông tin người bán</div>
			<div className='mt-3 flex items-center justify-between'>
				<div className='pl-2'>
					<div className='flex items-center pb-3'>
						<Link href={`/${productDetails.merchant.portalLink}`}>
							<a className='font-sfpro_bold text-14 font-semibold uppercase leading-5 text-primary-009ADA'>
								{productDetails.merchant.name}
							</a>
						</Link>

						{productDetails.averageStar && ratingStar?.total ? (
							<>
								<Icon name={IconEnum.Heart} color={'#757575'} size={12} className={'ml-3'} />
								<span className='px-1 '> {productDetails.averageStar}</span>
								<Link href='/'>
									<a className='text-primary-009ADA'>(Xem {ratingStar.total || 0} đánh giá)</a>
								</Link>
							</>
						) : (
							''
						)}
					</div>
					<div className='flex items-center'>
						<div className='flex items-center pr-4 text-14 font-medium'>
							<span className='mr-1.5 font-medium text-gray-500'>
								{infoMerchant?.extra?.totalProduct}
							</span>
							<span
								style={{ color: 'rgba(0, 0, 0, 0.38)' }}
								className='font-sfpro_semiBold text-xs text-slate-300'
							>
								Sản phẩm
							</span>
						</div>
						<div className=' flex items-center pr-4 text-14 font-medium'>
							<span className='mr-1.5 font-medium text-gray-500'>
								{infoMerchant?.extra?.totalStore}
							</span>
							<span
								style={{ color: 'rgba(0, 0, 0, 0.38)' }}
								className='font-sfpro_semiBold text-xs text-slate-300'
							>
								Chi nhánh
							</span>
						</div>
					</div>
				</div>
			</div>
			<Link href={`/${productDetails.merchant.portalLink}`}>
				<a className='absolute top-2/4 right-0 -translate-y-2/4 -translate-x-0'>
					<div className='relative h-[65px] w-[65px] overflow-hidden rounded-full'>
						<ImageCustom
							src={productDetails?.merchant?.avatarImage}
							alt='star'
							className='object-cover'
						/>
					</div>
				</a>
			</Link>

			<div
				className={classNames(
					[
						'flex items-center justify-between px-3 mt-4 text-14 border-t-2 border-b-2 border-[#F6F6F6] relative z-[2]',
					],
					[MODE_RUNNER.PREVIEWING, MODE_RUNNER.PREVIEW_PROMOTION]?.includes(mode!)
						? 'grayscale filter cursor-not-allowed -z-10 relative'
						: '',
				)}
			>
				<div className='flex flex-auto cursor-pointer items-center justify-center'>
					<Icon name={IconEnum.Heart} color={'#757575'} size={20} />
					<span className='animation-300 block pl-2 hover:text-F05A94'>
						Thích ({infoMerchant?.extra?.totalLike})
					</span>
				</div>
				<div
					onClick={() => handleOpenChat()}
					onKeyPress={() => handleOpenChat()}
					tabIndex={0}
					role={'button'}
					className='flex flex-auto cursor-pointer items-center justify-center border-x-2 border-[#F6F6F6] py-3'
				>
					<Icon name={IconEnum.ChatText} color={'#757575'} size={20} />
					<span className='animation-300 block pl-2 hover:text-F05A94'>Chat</span>
				</div>
				<div className='group relative flex flex-auto cursor-pointer items-center justify-center'>
					<Icon name={IconEnum.Phone} color={'#757575'} size={20} />
					<span className='animation-300 block pl-2 hover:text-F05A94'>Gọi</span>
					<Icon name={IconEnum.CaretDown} color={'#757575'} size={20} className={'ml-2'} />

					<div className='animation-300 invisible absolute top-[120%] rounded-md border border-[#E0E0E0] bg-white text-center opacity-0 shadow-md group-hover:visible group-hover:opacity-100'>
						<div className='mx-3 inline-block border-b border-[#E0E0E0] py-2'>Gọi trực tiếp</div>
						<div className='px-3 py-2'>Gọi video</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SellerInformation;
