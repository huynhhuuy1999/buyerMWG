import { ProductCard } from 'components';
import Link from 'next/link';
import { useState } from 'react';

const LiveStreamMobile = () => {
	const [listArr] = useState([
		{
			description: 'Viên gia vị phở bò',
			price: 2000000,
			img: '/static/images/adidas.png',
			isDealShock: true,
			percentDiscount: 20,
			isHeart: false,
			shippingFee: 15000,
			priceDash: 25000000,
			rating: {
				rate: 4.8,
				total: 102,
			},
			shop: {
				img: '/static/images/tgdd-logo.png',
				name: 'Bách hóa xanh',
			},
			isAssurance: true,
		},
		{
			description: 'Viên gia vị phở bò',
			price: 1000000,
			img: '/static/images/category-shirt.png',
			isDealShock: false,
			percentDiscount: 8,
			isHeart: true,
			rating: {
				rate: 3.8,
				total: 102,
			},
			priceDash: 25000000,
			shop: {
				img: '/static/images/tgdd-logo.png',
				name: 'Bách hóa xanh',
			},
			isAssurance: true,
		},
		{
			description: 'Nike',
			price: 4577760,
			img: '/static/images/category-shirt.png',
			isDealShock: true,
			percentDiscount: 50,
			shippingFee: 15000,
			priceDash: 25000000,
			shop: {
				img: '/static/images/tgdd-logo.png',
				name: 'Bách hóa xanh',
			},
			isAssurance: true,
		},
		{
			description: 'Converse',
			price: 8886670,
			img: '/static/images/adidas.png',
			isDealShock: false,
			percentDiscount: 80,
			isHeart: true,
			priceDash: 25000000,
			rating: {
				rate: 2.8,
				total: 102,
			},
			shop: {
				img: '/static/images/tgdd-logo.png',
				name: 'Bách hóa xanh',
			},
			isAssurance: true,
		},
		{
			description: 'Sony',
			price: 88999090,
			img: '/static/images/category-shirt.png',
		},
	]);

	return (
		<div className='mt-4 bg-white py-7'>
			<div className='container'>
				<div className='mb-4 flex justify-between'>
					<p className='text-20 font-bold text-3E3E40 '>LIVESTREAM</p>
					<Link href={'/'}>
						<p className='cursor-pointer self-center font-sfpro_semiBold text-16 hover:opacity-80'>
							Xem tất cả {`>`}
						</p>
					</Link>
				</div>
				<div className='flex gap-4 overflow-auto'>
					{listArr.map((item, index) => (
						<ProductCard.ProductCard
							key={index}
							description={item.description}
							price={item.price}
							image={item.img}
							isDealShock={item?.isDealShock}
							percentDiscount={item?.percentDiscount}
							isHeart={item?.isHeart}
							priceDash={item?.priceDash}
							shippingFee={item?.shippingFee}
							type={ProductCard.ProductType.liveStream}
							rating={item?.rating}
							shop={item?.shop}
							isAssurance={item?.isAssurance}
							width='208px'
							height='252px'
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default LiveStreamMobile;
