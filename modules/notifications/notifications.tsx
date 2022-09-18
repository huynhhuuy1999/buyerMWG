import classNames from 'classnames';
import { ImageCustom } from 'components';
import React, { useEffect, useRef, useState } from 'react';

import { listMockup } from '@/modules/notifications/mockup';

import { STATUS_NOTI } from './constant';

interface INotification {}

const TabNoti = [
	{
		type: 0,
		title: 'Thông báo chung',
		icon: '/static/svg/home.svg',
	},
	{
		type: 1,
		title: 'Thông báo khuyến mãi',
		icon: '/static/svg/promotions.svg',
	},
	{
		type: 2,
		title: 'Thông báo đơn hàng',
		icon: '/static/svg/shopping-cart.svg',
	},
	{
		type: 3,
		title: 'Thông báo hệ thống',
		icon: '/static/svg/system.svg',
	},
];

const Notification: React.FC<INotification> = () => {
	const [typeNoti, setTypeNoti] = useState<number>(0);
	const [listAll, setListAll] = useState(listMockup);
	const [listNoti, setListNoti] = useState(listMockup);
	const refContent = useRef<HTMLDivElement>(null);
	const refHeader = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (typeNoti === 0) {
			setListNoti(listAll);
		} else {
			setListNoti(listAll.filter((item) => item.type === typeNoti));
		}
	}, [typeNoti, listAll]);

	useEffect(() => {
		if (refContent.current && refHeader.current) {
			refHeader.current.style.width = refContent.current.clientWidth + 'px';
		}
	}, [refContent, refHeader]);

	const handleDel = (id: number) => {
		setListAll(listAll.filter((item) => item.id !== id));
	};

	const handleReadNoti = (id: number) => {
		let newList = listAll.map((item) => {
			if (item.id === id) {
				return {
					...item,
					status: STATUS_NOTI.READ,
				};
			}
			return item;
		});
		setListAll(newList);
	};

	return (
		<div className='container'>
			<div>
				<div
					className='sticky !top-[55px] z-30 mb-2 flex items-center justify-between rounded-t-[10px] border-b border-b-[#efefef] bg-white px-2 shadow-profileCard'
					ref={refHeader}
				>
					<div className='flex items-center'>
						{TabNoti.map((item, index) => {
							return (
								<div
									key={index}
									onClick={() => setTypeNoti(item.type)}
									onKeyPress={() => setTypeNoti(item.type)}
									tabIndex={0}
									role='button'
									className={classNames([
										'inline mx-4 py-4 text-sm group relative hover:text-F05A94 transition-all duration-150 cursor-pointer',
										typeNoti === item.type ? 'text-F05A94' : '',
									])}
								>
									{item.title}
									{typeNoti === item.type ? (
										<span className='absolute bottom-1 left-0 w-full border-b-[3px] border-F05A94 text-F05A94 '></span>
									) : (
										<span className='absolute bottom-1 left-0 w-full transition-all duration-150 group-hover:border-b-[3px] group-hover:border-F05A94 group-hover:text-F05A94'></span>
									)}
								</div>
							);
						})}
					</div>
					<div className='relative h-7 w-7' role={'button'}>
						<ImageCustom layout='fill' src={'/static/svg/carbon_overflow-menu-vertical.svg'} />
					</div>
				</div>
				<div className='mt-[45px] bg-white py-3' ref={refContent}>
					{listNoti.map((item, index) => {
						return (
							<div key={index} className='flex items-center border-b p-4'>
								<ImageCustom src={item.icon} alt='' width={28} height={28} />
								<div className='ml-5 flex-1 text-13'>
									<span className='text-333333'>{item.content}</span>
									<span className='ml-1 text-[#1da1f2]' role='button'>
										Chi tiết
									</span>
								</div>
								<div className='z-20 mx-3 flex min-w-[100px] flex-col items-center text-13'>
									{item.status === STATUS_NOTI.UNREAD ? (
										<span
											role={'button'}
											className='text-[#1da1f2]'
											tabIndex={0}
											onKeyPress={() => handleReadNoti(item.id)}
											onClick={() => handleReadNoti(item.id)}
										>
											Đánh dấu đã đọc
										</span>
									) : null}

									<span>{item.time}</span>
								</div>
								<div
									role={'button'}
									onClick={() => handleDel(item.id)}
									onKeyPress={() => handleDel(item.id)}
									tabIndex={0}
								>
									<span className='text-[#ff424e]'>Xóa</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Notification;
