import { useRouter } from 'next/router';
import { FC } from 'react';

const ComingSoonMobile: FC = () => {
	const router = useRouter();
	return (
		<div className='h-screen'>
			<div className='flex h-full flex-col bg-[#FEECE0] pt-[72px]'>
				<div className='text-center text-[45px] font-black not-italic leading-[81px] text-[#EE4E00]'>
					Sắp ra mắt!
				</div>
				<div className='px-4'>
					<div className='mx-auto mb-[20px] text-center text-[16px] font-normal not-italic leading-normal text-[#263238]'>
						Chúng tôi đang làm việc để nâng cấp hệ thống. Trong thời gian này chị <b>Vân</b> có thể
						dạo quanh trang <span className='text-[#008CC6]'>Facebook</span> hoặc{' '}
						<span className='text-[#008CC6]'>Youtube</span> của{' '}
						<span className='text-[#008CC6]'>VuiVui.com</span> để nhận thêm thông tin nhé !
					</div>
				</div>
				<img className='mx-auto h-1/3' src='/static/svg/coming-soon.svg' alt='' />
				<div className='flex justify-center bg-[#FEECE0] py-8 '>
					<button
						type='button'
						onClick={() => router.push('/')}
						className='bg-[#f05a94] px-10 py-2 text-base font-normal not-italic leading-normal tracking-[0.04px] text-white'
					>
						Về trang chủ
					</button>
				</div>
				<div className='flex-1 bg-[#FEECE0] px-7 py-5 '>
					<div className='mx-auto text-center text-14 font-normal not-italic leading-normal text-[#263238]'>
						<div>
							Nếu bạn cần hỗ trợ chúng tôi luôn sẵn sàng từ <br /> 7:00 - 21:30
						</div>
						<div>
							Liên hệ ngay <span className='text-[#008CC6]'>1900.1908</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ComingSoonMobile;
