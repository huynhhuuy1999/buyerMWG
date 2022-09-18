import { FilterBar, ImageCustom, ITabs } from 'components';
import { EmptyImage } from 'constants/';
import { useAppSelector, useIsomorphicLayoutEffect, useOnClickOutside } from 'hooks';
import { debounce } from 'lodash';
import { ShopInterface } from 'models';
import { useRouter } from 'next/router';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { postMerchantLike } from 'services';

import { cartSelector } from '@/store/reducers/cartSlice';

interface Props {
	data?: ShopInterface;
	tabs?: ITabs[];
	onChangeTabs?: (tab: number) => void;
	onSearch: (keyword: string) => void;
	keyword?: string;
	loading?: boolean;
}

const ShopHeaderMobile: React.FC<Props> = ({
	data,
	tabs = [],
	onChangeTabs,
	onSearch,
	keyword,
}: Props) => {
	const headerElement: any = useRef(null);
	const tempElement: any = useRef(null);
	const callElement = useRef(null);

	const totalItemCart = useAppSelector(cartSelector);

	const router = useRouter();

	const [isLike, setIsLike] = useState(false);
	const [openCall, setOpenCall] = useState(false);

	const { control, handleSubmit, setValue } = useForm<any>({
		mode: 'onSubmit',
	});

	const [copied, setCopied] = useState(false);

	useIsomorphicLayoutEffect(() => {
		headerElement.current = window.document?.getElementById('shop-header-mobile');
		tempElement.current = window.document?.getElementById('shop-temp-mobile');
	}, []);

	useIsomorphicLayoutEffect(() => {
		const handleScrollWindow = () => {
			let checkScroll = 186;

			const position: number = window.scrollY;

			if (headerElement.current?.getBoundingClientRect().top <= 6) {
				headerElement.current?.classList?.add('fixed', 'top-0', 'left-0', 'shadow');
			}

			if (headerElement.current?.getBoundingClientRect().top <= 50 && position > checkScroll) {
				headerElement.current?.classList?.add('sticky-shop-header-mobile');
				headerElement.current?.classList?.remove('w-[calc(100vw_-_20px)]');

				tempElement.current?.classList?.remove('hidden');
			} else if (position <= checkScroll) {
				tempElement.current?.classList?.add('hidden');
				headerElement.current?.classList?.add('w-[calc(100vw_-_20px)]');
				headerElement.current?.classList?.remove(
					'sticky-shop-header-mobile',
					'fixed',
					'top-0',
					'left-0',
					'shadow',
				);
			}
		};

		window.addEventListener('scroll', handleScrollWindow);
		return () => {
			window.removeEventListener('scroll', handleScrollWindow);
		};
	});

	const handleClickOutside = () => {
		if (openCall) {
			setOpenCall(false);
		}
	};

	useOnClickOutside(callElement, handleClickOutside);

	const onSubmit = (value: any) => {
		onSearch(value?.keyword?.toString().replace() ?? '');
	};

	useEffect(() => {
		setValue('keyword', keyword);
	}, [keyword]);

	useEffect(() => {
		setCopied(false);
		setIsLike(!!data?.like);
	}, [data]);

	const handleCopyPortalLink = (text: string) => {
		const dummy = document.createElement('textarea');
		document.body.appendChild(dummy);
		dummy.value = process.env.NEXT_PUBLIC_DOMAIN_URL + '/' + text;
		dummy.select();
		document.execCommand('copy');
		document.body.removeChild(dummy);
		setCopied(true);
	};

	const handleLike = async (merchantId: number) => {
		let res = await postMerchantLike({ merchantId });
		if (res?.data) {
			setIsLike(res?.data?.is_like);
		}
	};

	const debouncedClick = debounce(() => {
		data?.merchantId && handleLike(data?.merchantId);
	}, 900);

	return (
		<>
			<div className='fixed top-0 z-[99] flex w-full items-center justify-between bg-[#F05A94] px-[10px] py-[15px] text-white text-base'>
				<div className='flex items-center '>
					<ImageCustom
						width={20}
						height={20}
						src='/static/svg/arrow-back-white.svg'
						alt=''
						className='bg-transparent mr-2'
						onClick={() => {
							router.back();
						}}
					/>
					<span>Thông tin người bán</span>
				</div>
				<button className='relative mr-3' onClick={() => router.push('/gio-hang')}>
					<ImageCustom
						width={22}
						height={22}
						src='/static/svg/cart-ffffff.svg'
						alt=''
						className='bg-transparent'
					/>
					{totalItemCart?.total > 0 && (
						<span
							className={`bg-[#DF0707] absolute top-[-6px] left-[${
								totalItemCart.total > 99 ? '18px' : '10px'
							}] text-[11px] font-bold leading-[16px] rounded-[20px] px-[5px] py-[0px] text-center`}
						>
							{totalItemCart.total > 99 ? (
								<>
									99
									<sup>+</sup>
								</>
							) : (
								totalItemCart.total
							)}
						</span>
					)}
				</button>
			</div>

			<div className='bg-[#F1F1F1] mt-[54px]'>
				<div className='container'>
					<div className='bg-[#F1F1F1] py-[10px]'>
						<div className='flex w-full items-center justify-between'>
							<div className='flex'>
								<div className='relative'>
									<div className='flex rounded-full border border-[#e0e0e0] '>
										<div className='relative h-[72px] w-[72px] '>
											<ImageCustom
												loading='lazy'
												src={data?.avatarImage || EmptyImage}
												layout='fill'
												alt=''
												className={`rounded-full object-cover`}
											/>
										</div>

										<div className='absolute bottom-0 left-[7px] flex items-center bg-[#EBF7FC] px-[3px]'>
											<ImageCustom
												src={'/static/svg/iconLogoYellow.svg'}
												alt=''
												width={12}
												height={12}
												priority
											/>
											<span className='ml-2px text-11 text-[#126BFB]'>Đảm bảo</span>
										</div>
									</div>
								</div>
								<div className='ml-4'>
									<h2 className='mt-4 font-sfpro_semiBold text-18 text-666666'>{data?.name}</h2>
									<div className='text-12 text-[#999]'>{data?.extra?.lastOnline}</div>
								</div>
							</div>

							<div className='flex'>
								<div
									className='relative cursor-pointer'
									onClick={() => handleCopyPortalLink(data?.portalLink || '')}
									onKeyPress={() => handleCopyPortalLink(data?.portalLink || '')}
									tabIndex={0}
									role={'button'}
								>
									<QRCodeCanvas
										value={process.env.NEXT_PUBLIC_DOMAIN_URL + '/' + data?.portalLink || ''}
										size={72}
									/>
									{copied ? (
										<img
											className='absolute top-7 left-7 hidden h-5 w-5 rounded-full bg-white group-hover:block'
											src='/static/svg/check-circle.svg'
											alt=''
										/>
									) : (
										<img
											className='absolute top-7 left-7 hidden h-5 w-5 rounded-sm bg-white group-hover:block'
											src='/static/svg/clipboard.svg'
											alt=''
										/>
									)}
								</div>
							</div>
						</div>
						<div className='mt-4 flex gap-5'>
							<div className='flex items-center'>
								<ImageCustom
									src='/static/svg/star-product.svg'
									width={12}
									height={12}
									alt=''
									priority
								/>
								<p className='m-1 text-14'>
									<span className='font-sfpro_semiBold text-[#333]'>
										{data?.extra?.averageRating}
									</span>
									<span className='text-[#126BFB]'> ({data?.extra?.totalRating})</span>
								</p>
							</div>
							<div className='flex items-center text-14 text-[#666]'>
								<span className='mr-[2px] font-sfpro_semiBold text-[#333]'>
									{data?.extra?.totalProduct}
								</span>{' '}
								Sản phẩm
							</div>
							<div className='flex items-center text-14 text-[#666]'>
								<span className='mr-[2px] font-sfpro_semiBold text-[#333]'>
									{data?.extra?.totalStore}
								</span>
								Chi nhánh
							</div>
						</div>
						<div className='mt-4 flex gap-2'>
							<div
								onClick={() => {
									debouncedClick();
								}}
								onKeyPress={() => {
									debouncedClick();
								}}
								tabIndex={0}
								role={'button'}
								className='flex items-center cursor-pointer rounded-[4px] border border-[#E0E0E0] px-3 py-[7px] text-12 text-333333 bg-white'
							>
								<ImageCustom
									width={20}
									height={20}
									src={isLike ? '/static/svg/heart-red.svg' : '/static/svg/heart-profile.svg'}
									alt=''
								/>
								<p className='ml-1'>
									Thích <span>{data?.extra?.totalLike}</span>
								</p>
							</div>
							<div className='flex items-center rounded-[4px] border border-[#E0E0E0] px-3 py-[7px] text-12 text-333333 bg-white'>
								<ImageCustom width={16} height={13} src={'/static/svg/chat-icon.svg'} alt='' />
								<p className='ml-1'>Chat ngay</p>
							</div>
							<div
								className='relative rounded-[4px] border border-[#E0E0E0] px-3 py-[7px] text-12 text-333333 bg-white'
								ref={callElement}
							>
								<button
									className='flex items-center'
									onClick={() => {
										setOpenCall(!openCall);
									}}
								>
									<ImageCustom width={20} height={20} src={'/static/svg/call-icon.svg'} alt='' />
									<p className='mx-1'>Gọi ngay</p>
									<ImageCustom
										width={7}
										height={4}
										src={'/static/svg/chevron-down-333333-2.svg'}
										alt=''
									/>
								</button>
								{openCall && (
									<div className='absolute top-[36px] left-0 z-10 border border-[#EBEBEB] bg-white min-w-full'>
										<ul className='px-2'>
											<li className='p-2 border-b-1px'>Gọi trực tiếp</li>
											<li className='p-2'>Gọi video</li>
										</ul>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='overflow-hidden bg-white pt-[10px]'>
				<div className='container'>
					<div id='shop-temp-mobile' className='container hidden h-[96px]'></div>
					<div
						id='shop-header-mobile'
						className='bg-[#F1F1F1]e z-[5] w-[calc(100vw_-_20px)-mobile]'
					>
						{tabs?.length > 0 && (
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className='flex'>
									<div className='flex w-[calc(100vw_-_17px)] items-center rounded-md border border-[#E0E0E0] px-3 py-2'>
										<Controller
											control={control}
											name='keyword'
											render={({ field }) => (
												<input
													{...field}
													className='flex-1 text-14 focus-visible:outline-none'
													placeholder={data?.name ? `Tìm trong shop` : 'Tìm sản phẩm'}
												/>
											)}
										/>
										<button type='submit'>
											<img
												src={'/static/svg/search-outline-ffffff.svg'}
												className='ml-1 h-5 w-5'
												alt=''
											/>
										</button>
									</div>
								</div>
							</form>
						)}
						<div className='w-[calc(100vw_-_20px)] overflow-auto'>
							<FilterBar tabs={tabs} onChangeTab={onChangeTabs} type='shop' />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ShopHeaderMobile;
