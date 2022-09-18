import { ModalCustom, RadioField } from 'components';
import { OrderDetails } from 'models';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { handleCancelOrderWithReason } from 'utils';

import { CancelOrderReason } from '@/models/customer';

interface CancelOrderProps {
	isOpen: boolean;
	optionReasons?: CancelOrderReason[];
	onCancel: () => void;
	stateOrder?: OrderDetails | null;
	onMutate?: any;
}

const CancelOrder: React.FC<CancelOrderProps> = ({
	isOpen,
	optionReasons,
	stateOrder,
	onCancel,
	onMutate,
}) => {
	const [stateCancelOrder, setStateCancelOrder] = useState<number>(0);
	const router = useRouter();
	return (
		<React.Fragment>
			{isOpen ? (
				<ModalCustom className='!px-4' width={'!w-[40%]'}>
					<p className='border-b border-[#E7E7E8] pb-4 font-sfpro_bold text-18 font-bold text-[#333333]'>
						Hủy đơn hàng
					</p>

					{optionReasons?.map((reason, index: number) => (
						<div className='flex items-center' key={index}>
							<div
								onClick={() => {
									setStateCancelOrder(reason?.key);
								}}
								onKeyPress={() => {
									setStateCancelOrder(reason?.key);
								}}
								tabIndex={0}
								role={'button'}
							>
								<RadioField
									name={'reasonCancel'}
									className={'min-h-[50px]'}
									id={String(reason?.key)}
									value={reason?.key}
									checked={stateCancelOrder === reason?.key}
									styles={{ label: 'w-[22px] h-[22px] cursor-pointer relative z-10' }}
								/>
							</div>
							<div className='ml-2'>{reason?.value}</div>
						</div>
					))}

					<div className='mt-4 flex items-center justify-center gap-4'>
						<button
							className='animation-300 flex-auto rounded-md border border-pink-F05A94 bg-pink-F05A94 p-3 text-white hover:bg-F05A94/80'
							onClick={() => {
								handleCancelOrderWithReason(
									stateOrder?.orderId!,
									stateOrder?.shipping?.orderSubId!,
									onMutate,
									() => router.push('/ca-nhan/don-hang/huy'),
								);
								setStateCancelOrder(0);
								onCancel();
							}}
						>
							Đồng ý
						</button>
						<button
							className='animation-300 flex-auto rounded-md border border-[#E7E7E8] p-3 hover:border-[#a9a9a9a9] hover:bg-[#a9a9a9a9] hover:text-white'
							onClick={() => {
								setStateCancelOrder(0);
								onCancel();
							}}
						>
							Hủy bỏ
						</button>
					</div>
				</ModalCustom>
			) : null}
		</React.Fragment>
	);
};

export default CancelOrder;
