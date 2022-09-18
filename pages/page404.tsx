import { ImageCustom } from 'components';
import { ModalFeedback } from 'modules';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
const Page404 = () => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const handleShowModal = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<div className='alignCenterScreen__fixed text-center'>
				<div className='relative mx-auto mb-6 aspect-square w-[150px]'>
					<ImageCustom
						layout='fill'
						alt='icon not found'
						src={'/static/svg/not-found-404.icon.svg'}
					/>
				</div>
				<div className='mb-6 flex flex-col'>
					<div className='mb-[8px] text-18 font-semibold leading-7 text-[#3E3E40]'>
						Đã có lỗi xảy ra
					</div>
					<span className='text-14 leading-5 text-[#6E6E70]'>
						Vui lòng báo lỗi để VuiVui phục vụ bạn tốt hơn.
					</span>
				</div>

				<div className='mx-auto flex w-full flex-col space-y-4'>
					<div
						role={'button'}
						tabIndex={-1}
						className='px-auto rounded-full bg-pink-F05A94 py-[8px] font-semibold uppercase text-white cursor-pointer'
						onClick={() => handleShowModal()}
						onKeyPress={() => handleShowModal()}
					>
						Báo lỗi
					</div>
					<div
						className='px-auto rounded-full border border-[#ededed] py-[8px] font-semibold uppercase text-[#333333]'
						onClick={() => router.back()}
						onKeyPress={() => router.back()}
						tabIndex={0}
						role={'button'}
					>
						thử tải lại trang
					</div>
				</div>

				<div className='flex items-center justify-center gap-1 pt-7 text-[#6E6E70]'>
					Hoặc
					<Link href={'/'}>
						<div className='cursor-pointer text-pink-F05A94'>Về trang chủ</div>
					</Link>
				</div>
			</div>
			{isOpen && <ModalFeedback isOpen={isOpen} onShowModal={handleShowModal} />}
		</>
	);
};

export default Page404;
