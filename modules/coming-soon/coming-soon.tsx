import { useRouter } from 'next/router';
import { FC } from 'react';

const ComingSoon: FC = () => {
	const router = useRouter();
	return (
		<>
			<div className=' flex h-[calc(100vh_-_96px)] py-6 flex-col justify-center overflow-hidden bg-[#FEECE0]'>
				<div className='text-center font-sfpro_bold text-6xl font-black not-italic leading-[81px] text-[#EE4E00]'>
					Sắp ra mắt!
				</div>
				<div className='mb-[30px] grid grid-cols-4'>
					<div className='col-span-2 col-start-2 text-center text-lg font-normal not-italic leading-normal text-[#263238]'>
						Chúng tôi đang làm việc để nâng cấp hệ thống. Trong thời gian này chị Ngân có thể dạo
						quanh trang <span className='text-[#008CC6]'>Facebook</span> hoặc{' '}
						<span className='text-[#008CC6]'>Youtube</span> của{' '}
						<span className='text-[#008CC6]'>VuiVui.com</span> để nhận thêm thông tin nhé !
					</div>
				</div>
				<img
					className='mx-auto max-h-[200px] h-full w-auto'
					src='/static/svg/coming-soon.svg'
					alt='coming-soon'
				/>
				<div className='mt-10 mb-11 flex justify-center'>
					<button
						type='button'
						onClick={() => router.push('/')}
						className='bg-[#F05A94] px-10 py-2 text-base font-normal not-italic leading-normal tracking-[0.04px] text-white'
					>
						Về trang chủ
					</button>
				</div>
				{/* <div className='grid grid-cols-4'>
					<div className='col-span-2 col-start-2 text-center text-lg font-normal not-italic leading-normal text-[#263238]'>
						<div>Nếu bạn cần hỗ trợ chúng tôi luôn sẵn sàng từ 7:00 -21:30</div>
						<div>
							Liên hệ ngay <span className='text-[#008CC6]'>1900.1908</span>
						</div>
					</div>
				</div> */}
			</div>
		</>
	);
};

export default ComingSoon;
