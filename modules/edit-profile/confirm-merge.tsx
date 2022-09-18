import { ImageCustom } from 'components';
import React from 'react';

interface IConfirmMerge {
	info: any;
	onOK?: () => void;
	onClose?: () => void;
}

const ConfirmMerge: React.FC<IConfirmMerge> = ({ info, onOK, onClose }) => {
	return (
		<div className='relative bg-white px-4 pt-2 pb-4'>
			<div className='mx-auto flex items-center justify-center'>
				<div className='mt-5 text-left'>
					<div className='mb-[30px] text-center flex justify-center'>
						<ImageCustom
							className='cursor-pointer '
							src='/static/svg/notify.svg'
							alt='notify'
							height={70}
							width={70}
						/>
					</div>

					<p className='color-[#333333] mb-[8px] font-sfpro_semiBold text-18'>
						Số điện thoại {info?.phone || ''} đang được sử dụng trên app VuiVui.com cài ở thiết bị{' '}
						{info?.phoneName || ''}
					</p>

					<p className='color-[#333333] mb-[52px] font-sfpro text-16'>
						Nếu tiếp tục trên thiết bị hiện tại, số điện thoại {info?.phone || ''} sẽ không thể sử
						dụng trên app VuiVui cài ở thiết bị khác
					</p>

					<p className='color-[#333333] mb-[12px] font-sfpro_semiBold text-16'>
						Bạn có chắc muốn tiếp tục?
					</p>

					<button
						className='mb-[8px] w-full rounded-[6px] bg-[#EA001B] py-[14px] text-[#ffffff]'
						onClick={() => onOK && onOK()}
					>
						Có, tôi muốn tiếp tục trên thiết bị này
					</button>
					<button
						className='w-full rounded-[6px] bg-[#DADDE1] py-[14px] text-[#333333]'
						onClick={() => onClose && onClose()}
					>
						Huỷ bỏ
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmMerge;
