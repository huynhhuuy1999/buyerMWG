import { FilterBar, Icon, ImageCustom, ITabs, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { useAppChat, useIsomorphicLayoutEffect } from 'hooks';
import { debounce } from 'lodash';
import { MerchantChat, ShopInterface } from 'models';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { postMerchantLike } from 'services';

interface Props {
	data?: ShopInterface;
	tabs?: ITabs[];
	onChangeTabs: (tab: number) => void;
	onSearch: (keyword: string) => void;
	keyword?: string;
	loading: boolean;
}

const ShopHeader: React.FC<Props> = ({
	data,
	tabs = [],
	onChangeTabs,
	onSearch,
	keyword,
	loading,
}: Props) => {
	const headerElement: any = useRef(null);
	const tempElement: any = useRef(null);
	const payload: MerchantChat = {
		userId: data?.userId || '',
		name: data?.name,
		fullPath: data?.avatarImage,
		brandId: data?.userId || data?.id || '',
	};
	const { onHandleOpenChat } = useAppChat();

	const handleOpenChat = () => {
		onHandleOpenChat(payload);
	};

	const { control, handleSubmit, setValue } = useForm<any>({
		mode: 'onSubmit',
	});

	const [isLike, setIsLike] = useState(false);

	const [copied, setCopied] = useState(false);

	useIsomorphicLayoutEffect(() => {
		headerElement.current = window.document?.getElementById('shop-header');
		tempElement.current = window.document?.getElementById('shop-temp');
	}, []);

	useIsomorphicLayoutEffect(() => {
		const handleScrollWindow = () => {
			let checkScroll = 108;

			const position: number = window.scrollY;

			if (headerElement.current?.getBoundingClientRect().top <= 6) {
				headerElement.current?.classList?.add('absolute', 'top-0', 'left-0', 'shadow');
			}

			if (headerElement.current?.getBoundingClientRect().top <= 52 && position > checkScroll) {
				headerElement.current?.classList?.add('sticky-shop-header');
				tempElement.current?.classList?.remove('hidden');
			} else if (position <= checkScroll) {
				tempElement.current?.classList?.add('hidden');
				headerElement.current?.classList?.remove(
					'sticky-shop-header',
					'absolute',
					'top-0',
					'left-0',
					'shadow',
				);
			}
		};

		window.addEventListener('scroll', handleScrollWindow);
	});

	const onSubmit = (value: any) => {
		onSearch(value?.keyword?.toString().replace() ?? '');
	};

	useEffect(() => {
		setValue('keyword', keyword);
	}, [keyword]);

	useEffect(() => {
		if (data) setIsLike(!!data?.like);
	}, [data]);

	useEffect(() => {
		setCopied(false);
	}, []);

	const handleCopyPortalLink = (text: string) => {
		const dummy = document.createElement('textarea');
		document.body.appendChild(dummy);
		dummy.value = text;
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

	const Skeletons = (
		<div className='ml-6 h-[90px] w-full flex-1'>
			<div className='flex items-end justify-between'>
				<Skeleton.Skeleton className='w-[500px]' type='comment'></Skeleton.Skeleton>
				<div className='flex gap-2'>
					<div className='h-[72px] w-[72px]'>
						<Skeleton.Skeleton
							type='card'
							width={72}
							height={72}
							cardType={Skeleton.CardType.square}
						></Skeleton.Skeleton>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className='bg-white'>
			<div className='container pt-4 pb-3'>
				<div className='flex w-full items-center '>
					<div className='relative'>
						{!loading ? (
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
								<div className='absolute bottom-0 left-[7px] flex bg-[#EBF7FC] px-[3px]'>
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
						) : (
							<div className='relative h-[72px] w-full'>
								<Skeleton.Skeleton
									width={72}
									height={72}
									type='card'
									cardType={Skeleton.CardType.circle}
								/>
							</div>
						)}
					</div>
					{loading ? (
						Skeletons
					) : (
						<div className='ml-6 flex-1'>
							<div className='flex justify-between'>
								<div className='flex-1'>
									<h2 className='mt-4 font-sfpro_semiBold text-18 text-666666'>{data?.name}</h2>
									<div className='flex justify-between gap-4'>
										<div className='-mt-2 flex items-center gap-4'>
											<div className='text-12 text-[#999]'>{data?.extra?.lastOnline}</div>
											<div className='flex'>
												<ImageCustom
													src='/static/svg/star-product.svg'
													width={12}
													height={12}
													alt=''
													priority
												/>
												<p className='mr-2 text-12'>
													<span className='font-sfpro_semiBold text-[#666]'>
														{data?.extra?.averageRating}
													</span>
													<span className='text-[#126BFB]'> ({data?.extra?.totalRating})</span> Đánh
													giá
												</p>
											</div>
											<div className='flex text-12 text-[#666]'>
												<span className='mr-[2px] font-sfpro_semiBold'>
													{data?.extra?.totalProduct}
												</span>{' '}
												Sản phẩm
											</div>
											<div className='flex text-12 text-[#666]'>
												<span className='mr-[2px] font-sfpro_semiBold'>
													{data?.extra?.totalStore}
												</span>
												Chi nhánh
											</div>
										</div>

										<div className='flex gap-2'>
											<div
												onClick={() => {
													debouncedClick();
												}}
												onKeyPress={() => {}}
												role='none'
												tabIndex={0}
												className='hover-card flex cursor-pointer rounded-[4px] border border-[#E0E0E0] px-3 py-[7px] text-12 text-333333'
											>
												<ImageCustom
													width={20}
													height={20}
													src={
														isLike ? '/static/svg/heart-red.svg' : '/static/svg/heart-profile.svg'
													}
													alt=''
												/>
												<p className='ml-1'>
													Thích <span>{data?.extra?.totalLike}</span>
												</p>
											</div>
											<div
												className='hover-card flex rounded-[4px] border border-[#E0E0E0] px-3 py-[7px] text-12 text-333333'
												tabIndex={0}
												role='button'
												onClick={handleOpenChat}
												onKeyPress={handleOpenChat}
											>
												<Icon type='icon-lines-chat' size={18} className='ml-[-6px] mt-[2px]' />
												<p className='ml-1'>Chat ngay</p>
											</div>
											<div className='hover-card flex rounded-[4px] border border-[#E0E0E0] px-3 py-[7px] text-12 text-333333'>
												<Icon type='icon-call-1' size={18} className='ml-[-6px] mt-[2px]' />

												<p className='mx-1'>Gọi ngay</p>
												<Icon type='icon-chevron-bottom' size={18} className='mt-[2px]' />
											</div>
										</div>
									</div>
								</div>
								<div
									className='group relative mt-[18px] ml-4 cursor-pointer'
									onClick={() =>
										handleCopyPortalLink(
											process.env.NEXT_PUBLIC_DOMAIN_URL + '/' + data?.portalLink || '',
										)
									}
									role='button'
									tabIndex={0}
									onKeyPress={() =>
										handleCopyPortalLink(
											process.env.NEXT_PUBLIC_DOMAIN_URL + '/' + data?.portalLink || '',
										)
									}
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
					)}
				</div>
				<div id='shop-temp' className='container hidden h-[45px]'></div>
				<div
					id='shop-header'
					className='z-[5] mt-4 flex items-center justify-between  gap-2 bg-white'
				>
					{tabs?.length > 0 && (
						<div className='w-[100vw]'>
							<div className='container flex justify-between'>
								<FilterBar tabs={tabs} onChangeTab={(e) => onChangeTabs(e)} type='shop' />
								<form onSubmit={handleSubmit(onSubmit)}>
									<div className='flex items-center rounded-md border border-[#E0E0E0] px-3 py-2'>
										<Controller
											control={control}
											name='keyword'
											render={({ field }) => (
												<input
													{...field}
													className='flex-1 text-14 focus-visible:outline-none'
													placeholder={data?.name ? `Tìm trong ${data?.name}` : 'Tìm sản phẩm'}
												/>
											)}
										/>

										<button type='submit'>
											<Icon
												type='icon-search'
												size={12}
												variant='gray'
												className='mt-[-18px] ml-[-4px]'
											></Icon>
										</button>
									</div>
								</form>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ShopHeader;
