export type Unit = 'year' | 'month' | 'date' | 'hour' | 'minute' | 'second';

export enum Direction {
	UP = 1,
	DOWN = -1,
}

export interface DateConfig {
	format: string;
	caption: string;
	step: number;
	type: Unit;
}

export const dateConfigMap: {
	[key in Unit]: DateConfig;
} = {
	year: {
		format: 'YYYY',
		caption: 'Năm',
		step: 1,
		type: 'year',
	},
	month: {
		format: 'M',
		caption: 'Tháng',
		step: 1,
		type: 'month',
	},
	date: {
		format: 'D',
		caption: 'Ngày',
		step: 1,
		type: 'date',
	},
	hour: {
		format: 'hh',
		caption: 'Giờ',
		step: 1,
		type: 'hour',
	},
	minute: {
		format: 'mm',
		caption: 'Phút',
		step: 1,
		type: 'minute',
	},
	second: {
		format: 'hh',
		caption: 'Giây',
		step: 1,
		type: 'second',
	},
};
