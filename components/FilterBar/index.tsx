import classNames from 'classnames';
import { ReactNode, useRef } from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

export interface ITabs {
	id: number;
	title: string;
	active: boolean;
	path: string;
}

interface FilterBar {
	tabs?: ITabs[];
	toolbars?: any[];
	onChangeTab?: (tab: number) => void;
	onChooseTool?: (toolbar: number) => void;
	specificToolbar?: ReactNode;
	type?: string;
}

const FilterBar: React.FC<FilterBar> = ({
	tabs,
	toolbars,
	specificToolbar,
	onChangeTab = () => {},
	onChooseTool = () => {},
	type,
}) => {
	const filterBarTabElement: any = useRef(null);

	useIsomorphicLayoutEffect(() => {
		filterBarTabElement.current = window?.document.getElementById('filter-bar-tabs');
	}, []);

	useIsomorphicLayoutEffect(() => {
		if (filterBarTabElement.current && filterBarTabElement.current.scrollLeft !== undefined) {
			if (tabs && (tabs?.find((item) => item.active)?.id || 0) > 4) {
				filterBarTabElement.current.scrollLeft += 100;
			} else if ((tabs?.find((item) => item.active)?.id || 0) <= 4) {
				filterBarTabElement.current.scrollLeft -= 100;
			}
		}
	}, [tabs, filterBarTabElement.current]);

	return (
		<div
			className={classNames(
				'md:flex pb-3 pt-10px justify-between',
				type === 'shop' ? 'max-w-[1000px] overflow-auto hide-scrollbar' : 'pl-1',
			)}
			id='filter-bar-tabs'
		>
			{tabs && tabs?.length > 0 && (
				<div className='flex pb-1 md:pb-0'>
					{tabs?.map((tab: any, index: number) => {
						return (
							<button
								className={classNames([
									'whitespace-nowrap',
									!type && 'font-sfpro_semiBold text-14 md:text-16 ',
									type === 'shop' && 'text-14 md:text-14 ',
									tab.active
										? 'text-[#EF5191] border-b-2px border-[#EF5191] font-sfpro_semiBold'
										: 'text-3E3E40 border-b-2px border-transparent',
									index > 0 && 'ml-6',
								])}
								key={index}
								onClick={() => {
									onChangeTab(tab.id);
								}}
							>
								{tab.title}
							</button>
						);
					})}
				</div>
			)}
			{toolbars && toolbars?.length > 0 && (
				<div className='flex justify-between border-t border-E7E7E8 md:w-full md:justify-end md:border-none'>
					{toolbars.map((toolbar: any, index: number) => {
						return (
							<div className={`mt-4 flex md:ml-7 md:mt-0`} key={index}>
								<button
									onClick={() => onChooseTool(toolbar.id)}
									className='flex items-center whitespace-nowrap text-14 uppercase md:text-16 '
								>
									<img loading='lazy' src={toolbar.icon} className='mr-3' alt='' />
									{toolbar.title}
								</button>
							</div>
						);
					})}
				</div>
			)}
			{specificToolbar}
		</div>
	);
};

export default FilterBar;
