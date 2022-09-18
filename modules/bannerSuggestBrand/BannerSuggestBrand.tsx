import { ImageCustom } from 'components';
import Link from 'next/link';
import React from 'react';

interface IBannerSuggestBrand {
	image?: string;
}

export const BannerSuggestBrand: React.FC<IBannerSuggestBrand> = ({ image }) => {
	return (
		<div>
			<div className='relative h-[240px] max-h-[240px] w-full'>
				<ImageCustom
					src={image || '/static/images/mockup/bannerMockup.jpg'}
					layout='fill'
					objectFit='cover'
					quality={100}
				/>
			</div>
			<div className='bg-E5E5E5 py-4'>
				<div className='container '>
					<Link href={''}>
						<a href='' className='text-12 text-009ADA'>
							Trang chủ
						</a>
					</Link>
					{` / `}
					<Link href={''}>
						<a href='' className='text-12'>
							Thương hiệu gợi ý
						</a>
					</Link>
				</div>
			</div>
		</div>
	);
};
