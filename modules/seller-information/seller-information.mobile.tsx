import classNames from 'classnames';
import { ImageCustom } from 'components';
import { EmptyImage } from 'constants/';
import { MODE_RUNNER } from 'enums';
import { IProductDetailProps } from 'models';
import Link from 'next/link';
import React from 'react';
import { Icon, IconEnum } from 'vuivui-icons';

interface IUserInteraction {
	title: string;
	icon: JSX.Element;
	id: number;
	prefix?: number;
}

const SellerInformationMobile = React.forwardRef(
	({ productDetails, ratingStar, infoMerchant, mode }: IProductDetailProps, ref: any) => {
		const userActionAndSocialMedia: IUserInteraction[] = [
			{
				id: 1,
				title: 'Thích',
				prefix: infoMerchant?.extra?.totalLike,
				icon: <Icon name={IconEnum.Heart} size={16} />,
			},
			{
				id: 2,
				title: 'Chat ngay',
				icon: (
					<ImageCustom
						layout='fill'
						alt='icon vuivui'
						src={infoMerchant?.avatarImage ?? EmptyImage}
					/>
				),
			},
			{
				id: 3,
				title: 'Gọi ngay',
				icon: (
					<ImageCustom
						layout='fill'
						alt='icon vuivui'
						src={infoMerchant?.avatarImage ?? EmptyImage}
					/>
				),
			},
		];

		return (
			<div className='mt-4 px-4'>
				<div className='pb-3 font-sfpro_semiBold text-16 font-semibold normal-case'>
					Thông tin người bán
				</div>
				<div className='w-full'>
					<div className='pt-2 pb-4'>
						<div className='flex items-center'>
							<Link href={`/${productDetails.merchant.portalLink}`}>
								<a className='relative flex flex-col justify-center'>
									<div className='relative h-[70px] w-[70px] overflow-hidden rounded-full border border-[#E0E0E0]'>
										<ImageCustom
											src={productDetails?.merchant?.avatarImage}
											alt='star'
											layout='fill'
										/>
									</div>
									{productDetails.hasWarranty && (
										<div className='absolute bottom-0 z-10 flex w-full items-center bg-[#EBF7FC] px-1 py-[1px] text-16'>
											<div className='relative h-14px w-14px'>
												<img
													className='h-full w-full object-contain'
													src='/static/svg/iconLogoYellow.svg'
													alt='vuivui logo'
												/>
											</div>
											<span className='ml-1 text-[11px] font-medium normal-case text-[#126BFB]'>
												Đảm bảo
											</span>
										</div>
									)}
								</a>
							</Link>

							<Link href={`/${productDetails.merchant.portalLink}`}>
								<a className='ml-4 flex flex-col'>
									<span className='block font-sfpro_bold text-16 font-semibold capitalize leading-6 text-[#333333]'>
										{productDetails.merchant.name}
									</span>
									<span className='block text-12 font-normal leading-3 text-[#999999]'>
										{productDetails.merchant.lastOnline}
									</span>
								</a>
							</Link>
						</div>
					</div>

					<div className='flex items-center justify-between gap-4'>
						<div className='flex flex-auto items-center  text-14 text-[#666666]'>
							<span className='mr-1.5 font-sfpro_bold text-14 font-semibold leading-5 text-[#333333]'>
								<div className='relative h-3 w-3'>
									<ImageCustom src='/static/svg/star.svg' alt='star' layout='fill' />
								</div>
							</span>
							<span className='mr-1.5 font-sfpro_bold text-14 font-semibold leading-5 text-[#333333]'>
								{infoMerchant?.extra?.averageRating}
								<span className='font-sfpro text-14 leading-5 text-[#126BFB]'>
									({infoMerchant?.extra?.totalRating})
								</span>
							</span>
						</div>
						<div className='flex flex-auto items-center  text-14 text-[#666666]'>
							<span className='mr-1.5 font-sfpro_bold text-14 font-semibold leading-5 text-[#333333]'>
								{infoMerchant?.extra?.totalProduct}
							</span>
							<span style={{ color: 'rgba(0, 0, 0, 0.38)' }} className='text-xs text-slate-300'>
								Sản phẩm
							</span>
						</div>
						<div className=' flex flex-auto items-center  text-14 text-[#666666]'>
							<span className='mr-1.5 font-sfpro_bold text-14 font-semibold leading-5 text-[#333333]'>
								{infoMerchant?.extra?.totalStore}
							</span>
							<span style={{ color: 'rgba(0, 0, 0, 0.38)' }} className='text-xs text-slate-300'>
								Chi nhánh
							</span>
						</div>
					</div>
					{/* render social media */}
					<div
						className={classNames([
							'mt-3 flex items-center justify-between gap-2 overflow-x-scroll mb-4',
							[MODE_RUNNER.PREVIEWING, MODE_RUNNER.PREVIEW_PROMOTION]?.includes(mode!) &&
								'pointer-events-none',
						])}
						ref={ref}
					>
						{userActionAndSocialMedia.map((item, i: number) => (
							<div
								key={i}
								className='flex flex-[calc(100%_/_3)] items-center justify-center rounded-[6px] border border-[#E0E0E0] p-2 text-14 font-medium leading-4 last-of-type:mr-0'
							>
								<div
									className={classNames([
										'relative h-[16px] w-[16px]',
										i > 0 ? 'border-[#E0E0E0] border rounded-full overflow-hidden' : '',
									])}
								>
									{item.icon}
								</div>
								{item.title ? (
									<span className='pl-1.5 normal-case text-[#333333] whitespace-nowrap'>
										{item.title}
									</span>
								) : null}
								{item?.prefix ? <span className='block px-1'>({item?.prefix})</span> : null}
								{item.id === 3 && <Icon name={IconEnum.CaretDown} size={12} />}
							</div>
						))}
					</div>
				</div>
			</div>
		);
	},
);

export default SellerInformationMobile;
