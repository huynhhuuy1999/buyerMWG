import classNames from 'classnames';
import { ImageCustom } from 'components';
import { CategoryViewModel } from 'models';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
interface ICatalogSearchProps {
	catalogSearch: CategoryViewModel | undefined;
	textSearch?: string;
	onClose: () => void;
}
const CatalogSearch: React.FC<ICatalogSearchProps> = ({
	catalogSearch,
	textSearch,
	onClose,
}: ICatalogSearchProps) => {
	const router = useRouter();
	const renderLabel = (label: string) => {
		if (textSearch) {
			let index = label.toLowerCase().indexOf(textSearch.toLowerCase());
			if (index !== -1) {
				let length = textSearch.length;
				let prefix = label.substring(0, index);
				let suffix = label.substring(index + length);
				let match = label.substring(index, index + length);
				return (
					<span>
						{prefix}
						<span className='text-[#F05A94]'>{match}</span>
						{suffix}
					</span>
				);
			} else {
				let lstText = textSearch.split(' ');
				lstText
					.filter((x) => x !== null && x !== '')
					?.forEach(
						(item, index) =>
							(label = label.replaceAll(
								new RegExp(item + '(?!([^<]+)?<)', 'gi'),
								`<span key='${index}' class='text-[#F05A94]'>$&</span>`,
							)),
					);
				return <span dangerouslySetInnerHTML={{ __html: label }}></span>;
			}
		}
		return (
			<>
				<span>{label}</span>
			</>
		);
	};
	const handleRedirect = (urlSlug: string) => {
		router.push(`/${urlSlug}`);
		onClose();
	};
	const CatalogRecurse: React.FC<{ data?: CategoryViewModel }> = ({ data }) => {
		return (
			<div
				className={'align-center flex items-center space-x-1 p-1'}
				tabIndex={0}
				role='link'
				onClick={() => handleRedirect(data?.urlSlug || '')}
				onKeyPress={() => handleRedirect(data?.urlSlug || '')}
			>
				{data?.level === 3 && <ImageCustom src={data.image} width={32} height={32} />}
				<div
					className={classNames([
						(data?.level || 0) < 3 ? 'font-semibold text-[#333333]' : 'text-[#000000]',
						'w-full text-base leading-5 tracking-[0.02]',
					])}
				>
					{renderLabel(data?.name || '')}
				</div>
				<div className='w-[5%]'>&gt;</div>
			</div>
		);
	};
	return (
		<Fragment>
			{catalogSearch && (
				<Fragment>
					<CatalogRecurse data={catalogSearch} />
					{(catalogSearch?.children || []).map((item: CategoryViewModel, index) => (
						<div className='grid grid-cols-7 border-none py-1 pl-4 lg:space-x-4' key={index}>
							{item && (
								<div className='col-span-7 border-l border-dashed border-[#F05A94] pl-4'>
									<CatalogRecurse data={item} />
									{(item?.children || []).map((itemChild: CategoryViewModel, indexChild) => (
										<div
											className='grid grid-cols-7 border-none py-1 pl-4 lg:space-x-4'
											key={indexChild}
										>
											{itemChild && (
												<div className='col-span-7'>
													<CatalogRecurse data={itemChild} />
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					))}
				</Fragment>
			)}
		</Fragment>
	);
};

export default CatalogSearch;
