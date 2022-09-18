import classNames from 'classnames';
import React, { Fragment } from 'react';
import { numberWithCommas } from 'utils';

import { EmptyImage } from '@/constants/index';

import { ImageCustom } from '../..';
interface IMiniCardProps {
	image?: string;
	title?: string;
	price?: number;
	priceDash?: number;
}
const MiniCard: React.FC<IMiniCardProps> = ({ image, title, price, priceDash }: IMiniCardProps) => {
	return (
		<Fragment>
			<div
				className='grid grid-cols-6 xs:grid-cols-5 md:grid-cols-6 sm:grid-cols-6 lg:grid-cols-6 xl:grid-cols-7 content-center justify-center gap-2 py-1'
				title={title}
			>
				<div className='relative col-span-1 flex w-16 h-16 justify-center rounded-lg border border-[#E0E0E0] bg-[#FFF5F8]'>
					<ImageCustom layout='fill' className='rounded-lg' src={image ? image : EmptyImage} />
				</div>
				<div className='col-span-4 text-md text-black'>
					<div className='truncate break-all'>{title}</div>
					<div className='flex items-center space-x-2'>
						{price && (
							<span className='font-bold text-333333'>
								{numberWithCommas(price || 0, '.')}
								<sup className='ml-2px font-normal text-666666'>đ</sup>
							</span>
						)}
						{priceDash && (
							<span
								className={classNames(['font-normal text-666666', priceDash && 'line-through'])}
							>
								{numberWithCommas(priceDash || 0, '.')}
							</span>
						)}
						{price && priceDash && Math.round(((priceDash - price) * 100) / priceDash) > 0 ? (
							<span className='font-medium text-green-500'>
								-{Math.round(((priceDash - price) * 100) / priceDash)}%
							</span>
						) : (
							<></>
						)}
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default MiniCard;
