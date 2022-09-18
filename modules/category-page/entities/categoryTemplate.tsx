import { CATEGORY_LEVEL } from 'enums';

import { IBrand } from '@/models/brand';
import { CategoryViewModel } from '@/models/category';

export interface ICateTemplate {
	title: string;
	category?: CategoryViewModel | { id: number };
	brands?: IBrand[];
	setCategoryIds: () => Array<number>;
}

export class CategoryPageTemplate {
	[x: string]: any;

	constructor(props: any) {
		this.category = props?.category ?? { id: 0 };
		this.brands = props?.brands ?? [];
		this.title = props?.title ?? (process.env.NEXT_PUBLIC_DOMAIN_TITLE || 'VuiVui.com');
	}

	setCategoryIds() {
		if (
			this.category.level == CATEGORY_LEVEL.LEVEL_1 ||
			this.category.level === CATEGORY_LEVEL.LEVEL_2
		) {
			if (this.category?.children && this.category.children.length) {
				return this.category.children.reduce((list: Array<number>, t: CategoryViewModel) => {
					const categoryIds = t.children.map((item: CategoryViewModel) => item.id);
					return list.concat(categoryIds).concat([t.id]);
				}, []);
			}
		}

		return [this.category?.id];
	}
}
