import classnames from 'classnames';
import { Icon, ImageCustom } from 'components';
import { EmptyImage } from 'constants/';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';

import { postMerchantLike } from '@/services/shop';
const maxLengthProducts = 3;

interface IProps {
	data: any;
	isChangeLike?: boolean;
	onClickLike?: Function;
	onClickDoubleLike?: Function;
}
const CardMerchant = ({ data, onClickLike, onClickDoubleLike, isChangeLike = true }: IProps) => {
	const [isLike, setIsLike] = useState(false);

	useEffect(() => {
		setIsLike(data.isLiked);
	}, [data.isLiked]);

	const likeMerchant = async (merchantId: number) => {
		isChangeLike && setIsLike(!isLike);
		await postMerchantLike({ merchantId });
	};

	const promotion = () => {
		if (!!data.maxDiscouValue) {
			return `Giảm đến ${parseInt(data.maxDiscouValue)}%`;
		} else if (!!data.minPrice) {
			return `Giảm chỉ còn ${data.minPrice.toLocaleString('it-IT', {
				style: 'currency',
				currency: 'VND',
			})}`;
		}
		return '';
	};

	return (
		<Link href={`/${data.portalLink}`} passHref>
			<div className='animation-200 relative cursor-pointer overflow-hidden rounded-md bg-[#E0EBFD] p-1.5  hover:shadow-productCard'>
				<div className='bg-[#FFFFFF] p-1.5'>
					<div className='relative h-[207px]'>
						<div className='relative top-0 left-0 h-[207px] w-[246px]'>
							<ImageCustom src={data.waxrehouseImage || EmptyImage} width={246} height={207} />
							<div
								className='absolute bottom-0 right-[5px] cursor-pointer'
								onClick={(e) => {
									e.preventDefault();
									likeMerchant(data.merchantId);
									onClickLike?.();
								}}
								onDoubleClick={(e) => {
									e.preventDefault();
									likeMerchant(data.merchantId);
									// await useCancellablePromises().clearPendingPromises();
									onClickDoubleLike?.();
								}}
								tabIndex={0}
								onKeyPress={() => {}}
								role='button'
							>
								<ImageCustom
									src={isLike ? '/static/svg/heart-red.svg' : '/static/svg/heart.svg'}
									width={data.isMobile ? 20 : 24}
									height={data.isMobile ? 20 : 24}
									className='!bottom-0 !right-0'
									priority
								/>
							</div>
						</div>
						<div
							style={{
								boxShadow: '0px 0.1px 0.3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.2)',
							}}
							className='absolute bottom-2 left-2 flex h-[107px] w-[107px] items-center justify-center rounded-[3px] bg-[#FFFFFF] px-[3px] py-6'
						>
							<div className='relative  h-[71px] w-[99px]'>
								<ImageCustom
									src={data?.avatarImage?.filePath || EmptyImage}
									layout='fill'
									objectFit='contain'
								/>
							</div>
						</div>
					</div>
					<div className='flex justify-between bg-[#FFFFFF] p-[10px]'>
						<span className='font-sfpro_bold text-[16px] text-[#009908]'>{promotion()}</span>
						<Link href='/'>
							<div className='animation-300 flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-full bg-[#126BFB]	hover:bg-[#1c70f7] '>
								<Icon
									type='icon-chevron-right'
									variant='light'
									size={12}
									className='ml-[-7px] mt-[-7px]'
								/>
							</div>
						</Link>
					</div>
				</div>

				<div className='flex  items-center  justify-start py-1.5'>
					{data?.products?.length
						? (data.products.slice(0, maxLengthProducts) ?? data.products).map((item: any) => (
								<Fragment key={item.id}>
									<Link
										href={`/${
											item.categoryUrlSlug ? item.categoryUrlSlug + '/' + item?.urlSlug : +'#'
										} `}
									>
										<div
											className={classnames([
												'relative mr-[5px] h-[60px] w-[60px] cursor-pointer rounded-lg',
											])}
										>
											<ImageCustom
												loading='lazy'
												className='cursor-pointer rounded-lg object-cover transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none'
												src={item.variations?.[0]?.variationImage || EmptyImage}
												width={60}
												height={60}
											/>
										</div>
									</Link>
								</Fragment>
						  ))
						: 'Không có sản phẩm'}

					{data.products[maxLengthProducts] && data.products[maxLengthProducts].variations ? (
						<Link href='/'>
							<div className={classnames(['relative mr-[5px] h-[60px]  w-[60px] rounded-md'])}>
								<ImageCustom
									loading='lazy'
									className='cursor-pointer rounded-lg object-cover transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none'
									src={data.products[maxLengthProducts].variations[0].variationImage}
									width={60}
									height={60}
								/>
								<div
									role='button'
									tabIndex={0}
									style={{ background: 'rgba(0, 0, 0, 0.4)' }}
									className='absolute top-0 left-0 flex h-full w-full items-center justify-center text-white '
								>
									+{data.products.slice(maxLengthProducts, data?.products?.length)?.length}
								</div>
							</div>
						</Link>
					) : null}
				</div>
			</div>
		</Link>
	);
};
export default CardMerchant;
