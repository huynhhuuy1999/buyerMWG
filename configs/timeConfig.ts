export type timesMoment = {
	locales?: {
		vi?: string;
		en?: string;
	};
	timestamp?: string;
	custom?: {
		month?: string;
		year?: string;
		dayMonth?: string;
		dayMothYearh?: string;
		fullTime?: string;
		hour?: string;
		second?: string;
		fullDate?: string;
		timeWithDetailHour?: string;
		dayMonthYearWithDash?: string;
		dayMonthWithTime?: string;
		fullDateWithTime?: string;
		minutes?: string;
	};
};

const timeConfig: timesMoment = {
	locales: {
		vi: 'DD-MM-YYYY HH:mm:ss',
		en: 'YYYY-MM-DD : HH:mm:ss',
	},
	timestamp: 'X',
	custom: {
		month: 'MM',
		year: 'YYYY',
		dayMonth: 'DD-MM',
		dayMonthYearWithDash: 'DD/MM/YYYY',
		dayMonthWithTime: 'DD-MM HH:mm:ss',
		timeWithDetailHour: 'HH:mm',
		fullDate: 'dddd, DD MMMM',
		dayMothYearh: 'DD-MM-YYYY',
		fullDateWithTime: 'dddd, DD MMMM HH:mm:ss',
		fullTime: 'HH:mm:ss',
		hour: 'HH',
		second: 'ss',
		minutes: 'mm',
	},
};

export default timeConfig;
