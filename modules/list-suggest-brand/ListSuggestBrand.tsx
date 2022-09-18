import { CardBrand } from 'components';

import { IBrandSuggest } from '@/models/brand';

interface IListSuggestBrand {
	listSuggestBrand?: IBrandSuggest[];
}

export const ListSuggestBrand: React.FC<IListSuggestBrand> = ({ listSuggestBrand }) => {
	return (
		<div className='container flex grow flex-wrap justify-between'>
			{listSuggestBrand &&
				listSuggestBrand?.map((item: IBrandSuggest, index: number) => {
					return (
						<CardBrand
							nameBrand={item.name}
							avatar={item.avatarImage?.filePath}
							isLiked={item.isLiked}
							totalProduct={item.totalProduct}
							key={index}
							listProduct={item.products}
							className='mt-8'
						/>
					);
				})}
		</div>
	);
};
