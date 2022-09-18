import { FC, memo, ReactNode, useState } from 'react';
import { Icon, IconEnum } from 'vuivui-icons';
interface FooterProps {
	title: string;
	icon?: ReactNode;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Footer: FC | any = () => {
	const [isExpand, setIsExpand] = useState<boolean>(false);

	const footerMenu: FooterProps[] = [
		{
			title: 'Giới thiệu công ty',
			icon: <Icon name={IconEnum.CaretRight} color='#000' size={16} />,
		},
		{
			title: 'Đăng ký bán hàng',
			icon: <Icon name={IconEnum.CaretRight} color='#000' size={16} />,
		},
		{
			title: 'Quản lý gian hàng',
			icon: <Icon name={IconEnum.CaretRight} color='#000' size={16} />,
		},
		{
			title: 'Câu hỏi thường gặp',
			icon: <Icon name={IconEnum.CaretRight} color='#000' size={16} />,
		},
		{
			title: 'Đăng xuất',
			icon: <Icon name={IconEnum.CaretRight} color='#000' size={16} />,
		},
		{
			title: isExpand ? 'Thu gọn' : 'Xem thêm',
			icon: (
				<Icon name={isExpand ? IconEnum.CaretRight : IconEnum.CaretDown} color='#000' size={16} />
			),
			onClick: () => setIsExpand(!isExpand),
		},
	];

	const aboutVuiVui: FooterProps[] = [
		{
			title: 'Giới thiệu',
			icon: <Icon name={IconEnum.CaretRight} size={16} />,
		},
		{
			title: 'Tuyển dụng',
			icon: <Icon name={IconEnum.CaretRight} size={16} />,
		},
		{
			title: 'Điều khoản VuiVui',
			icon: <Icon name={IconEnum.CaretRight} size={16} />,
		},
		{
			title: 'Đăng ký bán hàng',
			icon: <Icon name={IconEnum.CaretRight} size={16} />,
		},
		{
			title: 'Quản lý gian hàng',
			icon: <Icon name={IconEnum.CaretRight} size={16} />,
		},
		{
			title: 'Gửi góp ý, khiếu nại',
			icon: <Icon name={IconEnum.CaretRight} size={16} />,
		},
		{
			title: 'Chính sách bảo hành, đổi trả',
			icon: <Icon name={IconEnum.CaretRight} size={16} />,
		},
		{
			title: 'Xem thêm',
			icon: <Icon name={IconEnum.CaretDown} size={16} />,
		},
	];

	const customerCare: FooterProps[] = [
		{
			title: 'Hướng dẫn mua hàng online',
			icon: <Icon name={IconEnum.CaretRight} className='-mt-1' size={16} />,
		},
		{
			title: 'Hướng dẫn đổi hàng',
			icon: <Icon name={IconEnum.CaretRight} className='-mt-1' size={16} />,
		},
		{
			title: 'Hướng dẫn bán hàng',
			icon: <Icon name={IconEnum.CaretRight} className='-mt-1' size={16} />,
		},
		{
			title: 'Câu hỏi thường gặp',
			icon: <Icon name={IconEnum.CaretRight} className='-mt-1' size={16} />,
		},
	];

	const Expand: FC = () => {
		return (
			<div tabIndex={-1} className='fixed left-0 bottom-0 z-50 h-full w-full'>
				<div
					className='pointer-events-auto absolute top-0 left-0 h-full w-full bg-[#00000073] opacity-100 transition-none'
					onClick={() => setIsExpand(false)}
					onKeyPress={() => setIsExpand(false)}
					tabIndex={0}
					role='button'
				/>
				<div className='absolute bottom-0 h-auto w-full shadow-md'>
					<div className='relative z-[1] h-full w-full overflow-auto border-0 bg-white bg-clip-padding'>
						<div className='flex h-full w-full'>
							<div className='grow overflow-auto break-words'>
								<div className='container flex justify-between py-[9px]'>
									{footerMenu.map((item, index) => (
										<div key={index}>
											<div
												className='float-left inline-block w-auto cursor-pointer'
												onClick={item.onClick}
												onKeyPress={() => item.onClick}
												tabIndex={0}
												role='button'
											>
												<div className='flex items-center'>
													<span className='mr-1 text-sm font-normal not-italic leading-normal tracking-[0.04px] text-[#3E3E40]'>
														{item.title}
													</span>
													{item.icon}
												</div>
											</div>
										</div>
									))}
								</div>
								<hr />
								<div className='container flex justify-between pt-5 pb-6'>
									<div className='space-y-3 text-sm font-normal not-italic leading-normal tracking-[0.04px] text-[#3E3E40]'>
										<button className='h-[35px] w-[120px] bg-[#4834D6] py-2'>
											<img
												className='mx-auto h-5 w-auto'
												alt='vuivui-logo'
												src='/static/svg/vuivui-logo-4834d6.svg'
											/>
										</button>
										<div className='space-y-1'>
											<div className='mb-2 font-sfpro_semiBold text-[16px] font-semibold not-italic leading-normal tracking-[0.04px] text-[#272728]'>
												CTY CP Thế Giới di động
											</div>
											<div>ĐKKD số 0314718634 do Sở KHĐT TP.HCM cấp ngày 1/12/2021</div>
											<div>
												<span className='font-sfpro_semiBold text-[14px] font-semibold not-italic leading-normal tracking-[0.04px] text-[#3E3E40]'>
													Văn Phòng:
												</span>{' '}
												128 Trần Quang Khải, P.Tân Định, Q.1, HCM
											</div>
											<div>
												<span className='font-sfpro_semiBold text-[14px] font-semibold not-italic leading-normal tracking-[0.04px] text-[#3E3E40]'>
													Email:
												</span>{' '}
												cskh@thegiodidong.com
											</div>
										</div>
										<img
											className='mt-2 h-11 w-auto cursor-pointer'
											alt='gov-logo'
											src='/static/svg/gov-logo.svg'
										/>
									</div>
									<div className='space-y-1 text-sm font-normal not-italic leading-normal tracking-[0.04px] text-[#3E3E40]'>
										<div className='mb-[10px] font-sfpro_semiBold text-[14px] font-semibold uppercase not-italic leading-normal tracking-[0.04px] text-[#272728]'>
											Về vuivui
										</div>
										{aboutVuiVui.map((item, index) => (
											<a
												key={index}
												className='ml-1 flex cursor-pointer items-center whitespace-nowrap'
											>
												<span>{item.title}</span>
												{item.icon}
											</a>
										))}
									</div>
									<div className='relative space-y-1 text-sm font-normal not-italic leading-normal tracking-[0.04px] text-[#3E3E40]'>
										<div className='mb-[10px] font-sfpro_semiBold text-[14px] font-semibold uppercase not-italic leading-normal tracking-[0.04px] text-[#272728]'>
											Chăm sóc khách hàng
										</div>
										<div>
											{customerCare.map((item, index) => (
												<a
													key={index}
													className='ml-1 flex cursor-pointer items-center whitespace-nowrap'
												>
													<span>{item.title}</span>
													{item.icon}
												</a>
											))}
										</div>
										<div className='absolute bottom-0 flex w-full flex-col'>
											<span className='mt-7 font-sfpro_semiBold text-[16px] font-semibold uppercase not-italic leading-normal tracking-[0.04px] text-black'>
												Kết nối
											</span>
											<div className='flex space-x-3'>
												<img
													className='h-[30px] w-auto cursor-pointer'
													alt='facebook-logo'
													src='/static/svg/facebook-logo.svg'
												/>
												<img
													className='h-[30px] w-auto cursor-pointer'
													alt='instagram-logo'
													src='/static/svg/instagram-logo.svg'
												/>
												<img
													className='h-[30px] w-auto cursor-pointer'
													alt='youtube-logo'
													src='/static/svg/youtube-logo.svg'
												/>
											</div>
										</div>
									</div>
									<div className='relative text-sm font-normal not-italic leading-normal tracking-[0.04px]'>
										<div className='mb-[10px] font-sfpro_semiBold text-[14px] font-semibold uppercase not-italic leading-normal tracking-[0.04px] text-[#272728]'>
											Tải ứng dụng trên điện thoại
										</div>
										<div className='flex space-x-2'>
											<img
												className='h-[98px] w-auto'
												alt='qr-code'
												src='/static/svg/qr-code-demo.svg'
											/>
											<div className='flex flex-col space-y-2'>
												<img
													className='h-[45px] w-32 cursor-pointer'
													alt='app-store'
													src='/static/svg/app-store-download.svg'
												/>
												<img
													className='h-[45px] w-32 cursor-pointer'
													alt='google-play'
													src='/static/svg/google-play-download.svg'
												/>
											</div>
										</div>
										<div className='absolute bottom-0 flex w-full flex-col'>
											<span className='mt-9 font-sfpro_semiBold text-[16px] font-semibold uppercase not-italic leading-normal tracking-[0.04px] text-black'>
												Phương thức thanh toán
											</span>
											<div className='flex space-x-2'>
												<img
													className='h-[30px] w-auto cursor-pointer'
													alt='visa'
													src='/static/svg/visa-logo.svg'
												/>
												<img
													className='h-[30px] w-auto cursor-pointer'
													alt='master-card'
													src='/static/svg/master-card-logo.svg'
												/>
												<img
													className='h-[30px] w-auto cursor-pointer'
													alt='jcb'
													src='/static/svg/jcb-logo.svg'
												/>
												<img
													className='h-[30px] w-auto cursor-pointer'
													alt='paypal'
													src='/static/svg/paypal-logo.svg'
												/>
											</div>
										</div>
									</div>
								</div>
								<div className='bg-[#E8E8E8] py-3'>
									<div className='container mx-auto text-center text-[13px] font-normal not-italic leading-normal tracking-[0.04px] text-black'>
										<div>
											© 2018. Công ty cổ phần Thế Giới Di Động. GPDKKD: 0303217354 do sở KH & ĐT
											TP.HCM cấp ngày 02/01/2007. GPMXH: 238/GP-BTTTT do Bộ Thông Tin và Truyền
											Thông cấp ngày 04/06/2020.
										</div>
										<div>
											Địa chỉ: 128 Trần Quang Khải, P. Tân Định, Q.1, TP.Hồ Chí Minh. Điện thoại:
											028 38125960. Email: cskh@thegioididong.com. Chịu trách nhiệm nội dung: Huỳnh
											Văn Tốt. Xem chính sách sử dụng
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			<div className='container z-10 flex justify-between py-[9px]'>
				{footerMenu.map((item, index) => (
					<div key={index}>
						<div
							className='float-left inline-block w-auto cursor-pointer'
							onClick={item.onClick}
							role='button'
							tabIndex={0}
							onKeyPress={() => item.onClick}
						>
							<div className='flex items-center'>
								<span className='mr-1 text-sm font-normal not-italic leading-normal tracking-[0.04px] text-[#3E3E40]'>
									{item.title}
								</span>
								{item.icon}
							</div>
						</div>
					</div>
				))}
			</div>
			{isExpand && <Expand />}
		</>
	);
};

export default memo(Footer);
