import { DeviceType } from 'enums';
import { useAppSelector } from 'hooks';
import { useRouter } from 'next/router';

import ImageCustom from '@/components/ImageCustom';
import DefaultLayout from '@/layouts/defaultLayout';
import DefaultLayoutMobile from '@/layouts/defaultLayout.mobile';
import { deviceTypeSelector } from '@/store/reducers/appSlice';

interface IError {
	// deviceType?: DeviceType;
}

const Error: React.FC<IError> = () => {
	const router = useRouter();
	const goBack = () => {
		router.push('/');
	};
	const deviceType = useAppSelector(deviceTypeSelector);

	return deviceType === DeviceType.MOBILE ? (
		<DefaultLayoutMobile>
			<div className='flex h-[100vh] flex-col items-center justify-center'>
				<div className='relative aspect-square w-[50%]'>
					<ImageCustom priority src={'/static/images/logo_oops.png'} layout='fill' />
				</div>
				<span className='text-18'>Hệ thống lỗi</span>
				<span className='mt-2 text-center text-[14px]'>Chúng tôi đang khắc phục</span>
				<span className='mt-2 text-center text-[14px] '>
					Xin lỗi vì sự bất tiện làm gián đoạn trải nghiệm của bạn.
				</span>
				<button
					className='mt-2 h-[40px] w-[100px] rounded-[8px] border-[1px] border-[#F05A94] text-[#F05A94]'
					onClick={goBack}
				>
					Trang chủ
				</button>
			</div>
		</DefaultLayoutMobile>
	) : (
		<DefaultLayout>
			<div className='flex flex-col items-center justify-center'>
				<div className='relative aspect-square w-[30%]'>
					<ImageCustom priority src={'/static/images/logo_oops.png'} layout='fill' />
				</div>
				<span className='mb-2 text-center text-20 font-semibold'>Hệ thống lỗi!!!</span>
				<span className='text-center text-[17px]'>
					Chúng tôi đang khắc phục. Xin lỗi vì sự bất tiện làm gián đoạn trải nghiệm của bạn.
				</span>
				<button
					className='mt-2 h-[40px] w-[100px] rounded-[8px] border-[1px] border-[#F05A94] text-[#F05A94]'
					onClick={goBack}
				>
					Trang chủ
				</button>
			</div>
		</DefaultLayout>
	);
};

export default Error;
