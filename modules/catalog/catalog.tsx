import classNames from 'classnames';
import { CategoryProductCard, Icon, ImageCustom } from 'components';
import { REGEX_IMAGE } from 'constants/';
import { useAppDispatch, useAppSelector } from 'hooks';
import { CategoryViewModel, ShowCatalog } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { appActions, selectedCatalogSector, showCatalogSector } from 'store/reducers/appSlice';
import { catalogListSelector, catalogSuggestionSelector } from 'store/reducers/categorySlide';

import { truncateString } from '@/utils/formatter';
export interface ICatalogProps {
	userAuth: any;
	onClose: () => void;
}

const CatalogCard: React.FC<{ item: CategoryViewModel; onClose: () => void; last?: boolean }> = ({
	item,
	onClose,
	last,
}) => {
	const router = useRouter();
	return (
		<>
			<div className='mb-3 py-7 px-2 font-sfpro_bold text-sm font-semibold text-black'>
				<div className='float-left'>{item?.name}</div>
				<div
					className='float-right cursor-pointer'
					onClick={() => {
						onClose();
						router.push(`/${item.urlSlug}`);
					}}
					onKeyPress={() => {
						onClose();
						router.push(`/${item.urlSlug}`);
					}}
					tabIndex={0}
					role='button'
				>
					Xem tất cả &gt;
				</div>
			</div>
			<div
				className={classNames(
					'justify-left flex w-full flex-wrap content-center pb-4',
					last ? '' : 'border-b border-b-gray-300 ',
				)}
			>
				{item?.children &&
					item.children
						.slice(0, item.urlSlug.indexOf('danh-muc-goi-y') !== -1 ? item.children.length : 8)
						.map((data, indexChil) => (
							<CategoryProductCard
								key={indexChil}
								image={data.image}
								className='mx-1 w-[79px] cursor-pointer py-1'
								classImage='w-[79px] h-[79px]'
								description={data.name}
								path={`/${data.urlSlug}`}
								onClick={onClose}
								type={'CATEGORY_PRODUCT_SMALL'}
							/>
						))}
			</div>
		</>
	);
};

const Catalog: React.FC<ICatalogProps> = ({ onClose, userAuth }) => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const catalog = useAppSelector(catalogListSelector);
	const catalogSuggestion = useAppSelector(catalogSuggestionSelector);
	const selectedSector = useAppSelector(selectedCatalogSector);
	const isOpenCatalog = useAppSelector(showCatalogSector);
	const [catalogList, setCatalogList] = useState<CategoryViewModel[]>(catalog);
	const [selectedItem, setSelectedItem] = useState<CategoryViewModel[]>(catalog?.[0]?.children);
	const [isSelectedNav, setSelectedNav] = useState<number>(catalog?.[0]?.id);

	const catalogRef = useRef<HTMLDivElement>(null);

	const handleSelectNavBar = (item: CategoryViewModel) => {
		if (item.id !== isSelectedNav) {
			setSelectedNav(item.id);
			setSelectedItem(item.children);
		}
	};

	useMemo(() => {
		if (catalogSuggestion) {
			setCatalogList([catalogSuggestion, ...(catalog || [])]);
		} else {
			setCatalogList(catalog);
		}
	}, [catalog, catalogSuggestion]);

	useEffect(() => {
		const urlSlug = router.query.slug_extend ? router.query.slug_extend : undefined;
		if (urlSlug) {
			dispatch(appActions.getSelectedCatalog({ catalog: catalog, urlSlug: urlSlug as string }));
		}
	}, [catalog, dispatch, router.query.slug_extend]);

	useEffect(() => {
		const urlSlug = router.query.slug_extend ? router.query.slug_extend : undefined;
		if (
			selectedSector &&
			selectedSector.length &&
			selectedSector?.[selectedSector?.length - 1]?.urlSlug === urlSlug &&
			urlSlug
		) {
			setSelectedItem(selectedSector?.[0]?.children);
			setSelectedNav(selectedSector?.[0]?.id);
		} else {
			setSelectedItem(catalogList?.[0]?.children);
			setSelectedNav(catalogList?.[0]?.id);
		}
	}, [catalogList, router.query.slug_extend, selectedSector]);

	useEffect(() => {
		const timeOut = setTimeout(() => {
			if (catalogRef.current) {
				catalogRef.current.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}, 100);
		return () => clearTimeout(timeOut);
	}, [selectedItem]);
	return (
		<div
			className={classNames([
				isOpenCatalog !== ShowCatalog.hidden ? 'opacity-100 z-40' : 'opacity-0 hidden',
				'transition-all duration-500',
				'flex items-center h-auto bg-gray-500 container',
			])}
		>
			<div className='flex w-full justify-center'>
				<div className='w-full bg-white'>
					<div className='flex w-full items-start space-x-2 rounded border border-gray-300 lg:space-x-4'>
						<div className='h-[88vh] w-[30%] overscroll-y-contain bg-[#F8F9FB]'>
							{userAuth && (
								<div
									className='px-8'
									role='button'
									tabIndex={0}
									onClick={() => {
										router.push('/ca-nhan/don-hang/cho-xac-nhan');
										onClose();
									}}
									onKeyPress={() => {
										router.push('/ca-nhan/don-hang/cho-xac-nhan');
										onClose();
									}}
								>
									<span className='flex h-16 w-full cursor-pointer items-center border-b border-b-gray-300 px-2'>
										<ImageCustom
											priority
											width={32}
											height={32}
											alt={
												userAuth?.fullName
													? truncateString(userAuth?.fullName, 15)
													: `[Chưa cập nhật]`
											}
											src={
												userAuth?.avatarImage?.fullPath &&
												REGEX_IMAGE.test(userAuth.avatarImage.fullPath)
													? userAuth.avatarImage.fullPath
													: '/static/images/avatar_default.png'
											}
											className='inline-block h-8 w-8 rounded-full ring-2 ring-white'
										/>
										<span className='px-2 text-lg font-semibold text-[#333333]'>
											{userAuth?.fullName
												? truncateString(userAuth?.fullName, 15)
												: `[Chưa cập nhật]`}
										</span>
										<Icon
											type='icon-chevron-right'
											className='mt-[2px]'
											size={24}
											variant={'dark'}
										/>
									</span>
								</div>
							)}
							<div className='flex h-10 w-full cursor-pointer items-center pl-10 pr-2'>
								<ImageCustom
									priority
									width={24}
									height={24}
									alt=''
									src='/static/svg/menu-catalog.svg'
									className='inline-block h-6 w-6'
								/>
								<span className='w-full px-2 text-[#F05A94]'>Danh mục</span>
								<Icon type={'icon-chevron-bottom'} size={18} className='absolute top-[5px]' />
							</div>
							<div
								className={classNames([
									userAuth ? 'max-h-[71vh]' : 'max-h-[81vh]',
									'pl-10 pr-4 overflow-y-auto custom_scrollbar z-40 overscroll-y-contain',
								])}
							>
								{(catalogList || []).map((item: CategoryViewModel, index: number) => (
									<div key={index} className='flex items-center'>
										<div
											className={classNames([
												item.id === isSelectedNav
													? 'text-FFFFFF transform bg-[#F05A94]'
													: 'hover:text-FFFFFF transform hover:bg-[#F05A94] mr-[13px]',
												'pl-2 py-1 cursor-pointer w-fill w-moz',
											])}
											role='menu'
											tabIndex={index}
											onClick={() => handleSelectNavBar(item)}
											onKeyPress={() => handleSelectNavBar(item)}
										>
											{item.name}
										</div>
										{item.id === isSelectedNav && (
											<div className='ml-[-10px] flex justify-start relative w-6 h-6 '>
												<ImageCustom
													priority
													layout='fill'
													// width={24}
													// height={24}
													src='/static/svg/arrow_right_7953D2.svg'
													className='w-2'
													alt=''
												/>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
						<div
							ref={catalogRef}
							className='custom_scrollbar h-[88vh] w-[70%] overflow-y-auto overscroll-y-contain bg-white'
						>
							{(selectedItem || []).map((item, index) => (
								<CatalogCard
									item={item}
									key={index}
									onClose={onClose}
									last={index === selectedItem?.length - 1}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default React.memo(Catalog);
