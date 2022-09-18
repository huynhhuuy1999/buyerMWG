import { orderStatusType } from 'enums';

import { FncRenderOrder } from '../../types';

const RenderOrderStatus: React.FC<FncRenderOrder> = ({ status, statusName }) => {
	const arrayObjects: { value: string | orderStatusType; keyName: string }[] = [];

	for (const [propertyKey, propertyValue] of Object.entries(orderStatusType)) {
		if (!Number.isNaN(Number(propertyKey))) {
			continue;
		}
		arrayObjects.push({ value: propertyValue, keyName: propertyKey });
	}

	const textOrderStatus = [
		{ color: 'text-FF7A00', key: orderStatusType.PENDING },
		{ color: 'text-FF7A00', key: orderStatusType.WAITING_FOR_THE_GOODS },
		{ color: 'text-FF7A00', key: orderStatusType.START_PICKING_UP_GOODS },
		{
			color: 'text-[#009908]',
			key: orderStatusType.COMPLETE_PICK_UP,
		},
		{ color: 'text-FF7A00', key: orderStatusType.PRINTED_NOTE },
		{ color: 'text-FF7A00', key: orderStatusType.READY_TO_DELIVER },
		{ color: 'text-FF7A00', key: orderStatusType.DELIVERY },
		{ color: 'text-[#009908]', key: orderStatusType.DELIVERED },
		{ color: 'text-red-500', key: orderStatusType.CANCEL },
		{ color: 'text-[#009908]', key: orderStatusType.COMPLETE },
		{ color: 'text-FF7A00', key: orderStatusType.RETURN_EXCHANGE },
	];

	return (
		<span
			className={`${
				textOrderStatus.find((i) => i.key === arrayObjects.find((t) => t.value === status)?.value)
					?.color
			}`}
		>
			{statusName}
		</span>
	);
};

export default RenderOrderStatus;
