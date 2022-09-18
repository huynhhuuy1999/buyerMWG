import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { IProductSearch } from '@/models/product';
import { numberWithCommas } from '@/utils/formatter';

import { ImageCustom } from '../..';

interface ICardBrandMobile {
	avatar?: string;
	name?: string;
	isLike?: boolean;
	numLike?: number;
	numRating?: number;
	numProduct?: number;
	isGuaranteed?: boolean;
	listProduct?: IProductSearch[];
	averageRating?: number;
	portalLink?: string;
}

const CardBrandMobile: React.FC<ICardBrandMobile> = ({
	avatar,
	name,
	isLike,
	numLike = 0,
	numRating = 0,
	numProduct = 0,
	isGuaranteed,
	listProduct,
	averageRating = 0,
	portalLink,
}) => {
	const router = useRouter();
	const listImage = useMemo(() => {
		return (
			listProduct?.map(
				(product) => product.variations?.[0].variationImage || '/static/images/empty-img.png',
			) || []
		);
	}, [listProduct]);

	const renderLayoutProduct = () => {
		switch (listImage.length) {
			case 1:
				return (
					<div className='relative h-[451px] w-full'>
						<ImageCustom src={listImage[0]} alt='' layout='fill' objectFit='contain' priority />
					</div>
				);
			case 2:
				return (
					<div className='flex'>
						{listImage.map((image, index) => (
							<div className='relative ml-[1px] aspect-square w-[50%]' key={index}>
								<ImageCustom src={image} alt='' layout='fill' objectFit='cover' priority />
							</div>
						))}
					</div>
				);
			case 3:
				const listImageCopy2 = [...listImage];
				return (
					<div className='flex'>
						<div className='relative h-[360px] w-[calc(100%_-_119px)]'>
							<ImageCustom src={listImage[0]} alt='' layout='fill' objectFit='cover' priority />
						</div>
						<div className='ml-[1px] flex flex-col'>
							{listImageCopy2.slice(1, 3).map((image, index) => (
								<div className='relative mb-[1px] h-[180px] w-[119px]' key={index}>
									<ImageCustom src={image} alt='' layout='fill' objectFit='cover' priority />
								</div>
							))}
						</div>
					</div>
				);

			default:
				const listImageCopy = [...listImage];
				return (
					// <div className='flex'>
					// 	<div className='relative h-[360px] w-[calc(100%_-_119px)]'>
					// 		<ImageCustom src={listImage[0]} alt='' layout='fill' objectFit='contain' priority />
					// 	</div>
					// 	<div className='ml-[1px] flex flex-col'>
					// 		{listImageCopy.slice(1, 4).map((image, index) => {
					// 			return listImage.length > 4 && index === 2 ? (
					// 				<div key={index} className='relative mb-[1px] h-[119px] w-[119px]'>
					// 					<div className='absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-[#0E0E10]/[0.4] font-sfpro_bold text-16 text-white'>
					// 						+ {numProduct - 3}
					// 					</div>
					// 					<ImageCustom src={image} alt='' layout='fill' objectFit='cover' priority />
					// 				</div>
					// 			) : (
					// 				<div key={index} className='relative mb-[1px] h-[119px] w-[119px]'>
					// 					<ImageCustom
					// 						src={image}
					// 						alt=''
					// 						// width={119}
					// 						// height={119}
					// 						layout='fill'
					// 						objectFit='cover'
					// 						priority
					// 					/>
					// 				</div>
					// 			);
					// 		})}
					// 	</div>
					// </div>
					<div className='grid grid-cols-2 grid-rows-2 gap-[1px]'>
						{listImageCopy.slice(0, 4).map((image, index) => {
							return listImage.length > 4 && index === 3 ? (
								<div key={index} className='relative aspect-square w-full'>
									<div className='absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-[#0E0E10]/[0.4] font-sfpro_bold text-16 text-white'>
										+ {numProduct - 3}
									</div>
									<ImageCustom src={image} alt='' layout='fill' objectFit='cover' priority />
								</div>
							) : (
								<div key={index} className='relative aspect-square w-full'>
									<ImageCustom src={image} alt='' objectFit='cover' layout='fill' priority />
								</div>
							);
						})}
					</div>
				);
		}
	};
	return (
		<div>
			<div className='flex items-center p-[10px]'>
				<div className='relative'>
					<div
						className='relative flex items-center justify-center rounded-full border'
						onClick={() => router.push(`/${portalLink}`)}
						onKeyPress={() => router.push(`/${portalLink}`)}
						tabIndex={0}
						role='button'
					>
						<ImageCustom
							src={avatar || '/static/images/empty-img.png'}
							alt=''
							width={56}
							height={56}
							priority
							objectFit='cover'
							className='rounded-full object-cover'
						/>
					</div>
				</div>
				<div className='ml-[10px] grow'>
					<div className='flex justify-between'>
						<span
							className=' text-ellipsis font-sfpro_bold text-16 text-333333 line-clamp-2'
							onClick={() => router.push(`/${portalLink}`)}
							onKeyDown={() => {}}
							tabIndex={0}
							role='button'
						>
							{name}
						</span>
						{isGuaranteed ? (
							<div className='flex items-center bg-[#EBF7FC] px-[3px]'>
								<ImageCustom
									src={'/static/svg/iconLogoYellow.svg'}
									width={12}
									height={12}
									alt=''
									priority
								/>
								<span className='ml-[2px] font-sfpro_semiBold text-11 text-[#126BFB]'>Đảm bảo</span>
							</div>
						) : null}
					</div>
					<div className='flex items-center'>
						{isLike ? (
							<ImageCustom
								src={'/static/svg/heart-red.svg'}
								width={12}
								height={10}
								alt=''
								priority
							/>
						) : (
							<ImageCustom
								src={'/static/svg/heart-profile.svg'}
								width={12}
								height={10}
								alt=''
								priority
							/>
						)}

						<span className='ml-[2px] text-12 text-[#666666]'>{`Thích (${numberWithCommas(
							numLike,
							'.',
						)})`}</span>
						<div className='mx-[6px] flex h-[2px] w-[2px] items-center rounded-full bg-[#333333]' />
						<ImageCustom src='/static/svg/star-product.svg' width={10} height={10} priority />
						<span className='ml-[2px] text-12 text-[#666666]'>
							{`${averageRating}`}
							<span className='text-[#126BFB]'>{` (${numberWithCommas(numRating, '.')})`}</span>
						</span>
						<div className='mx-[6px] flex h-[2px] w-[2px] items-center rounded-full bg-[#333333]' />
						<span className=' text-12 text-[#666666]'>{`${numProduct} Sản phẩm`}</span>
					</div>
				</div>
			</div>
			<div>{renderLayoutProduct()}</div>
			{listImage.length === 1 ? (
				<div className='flex justify-between px-[16px] py-[10px]'>
					<div className='flex items-center'>
						<span className='text-18 font-semibold text-black '>
							590.000<sup>đ</sup>
						</span>
						<span className='ml-[4px] mr-[1px] text-16 text-[#666666] line-through'>1.763.000</span>
						<span className='text-16 text-[#009908]'>-50%</span>
					</div>
					<div className='rounded-[4px] border border-[#E0E0E0] px-[6px] py-[10px] text-14 text-333333'>
						Mua ngay
					</div>
				</div>
			) : null}
		</div>
	);
};

export default CardBrandMobile;
