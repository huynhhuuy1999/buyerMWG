import { NextPage } from 'next';
import { useRouter } from 'next/router';

import ImageCustom from '@/components/ImageCustom';
import { DeviceType } from '@/enums/index';
import DefaultLayout from '@/layouts/defaultLayout';
import { deviceTypeSelector } from '@/store/reducers/appSlice';

import { useAppSelector } from '../hooks';
import { DefaultLayoutMobile } from '../layouts';

interface IDisconnect {
	deviceType?: DeviceType;
}

const Disconnect: NextPage<IDisconnect> = ({ deviceType }) => {
	const router = useRouter();

	const deviceTypeRedux = useAppSelector(deviceTypeSelector);

	const handleBack = () => {
		router.back();
	};

	return deviceType === DeviceType.MOBILE || deviceTypeRedux === DeviceType.MOBILE ? (
		<DefaultLayoutMobile>
			<div className='flex h-[100vh] w-full flex-col items-center justify-center'>
				<div
					className={`relative ${
						deviceType === DeviceType.MOBILE ? 'h-[200px] w-[240px]' : 'h-[300px] w-[350px]'
					} `}
				>
					<ImageCustom priority src={'/static/svg/disconnect.svg'} layout={'fill'} />
				</div>
				<span className='mt-3 font-sfpro_bold text-18'>Không có kết nối mạng</span>
				<span className='mt-[4px] text-14 text-[#000000]/[0.54]'>
					Vui lòng kiểm tra kết nối và thử lại
				</span>
				<button
					className='mt-[32px] h-[36px]  w-[134px] rounded-[20px] border border-[#F05A94] text-[#F05A94] hover:border-[#F05A94] hover:text-[#F05A94]'
					onClick={handleBack}
				>
					Thử lại
				</button>
			</div>
		</DefaultLayoutMobile>
	) : (
		<DefaultLayout>
			<div className='flex h-[100vh] w-full flex-col items-center justify-center'>
				<div className={`relative ${'h-[300px] w-[350px]'} `}>
					<ImageCustom priority src={'/static/svg/disconnect.svg'} layout={'fill'} />
				</div>
				<span className='mt-3 font-sfpro_bold text-22'>Không có kết nối mạng</span>

				<span className='mt-[4px] text-18 text-[#000000]/[0.54]'>
					Vui lòng kiểm tra kết nối và thử lại
				</span>
				<button
					className='mt-[32px] h-[40px]  w-[150px] rounded-[20px] border border-[#F05A94] text-[#F05A94] hover:border-[#F05A94] hover:text-[#F05A94]'
					onClick={handleBack}
				>
					Thử lại
				</button>
			</div>
		</DefaultLayout>
	);
};

export default Disconnect;
