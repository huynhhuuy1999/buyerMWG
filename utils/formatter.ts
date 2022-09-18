import moment from 'moment';

export const numberWithCommas = (value: string | number, typeSeparate: string) => {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, typeSeparate);
};

export const splitArrayWithMaxLine = (
	data: Array<any>,
	maxLine: number,
	maxElementWithoutScroll: number,
) => {
	let copyListBrand = [...data];
	let listSplit = [];
	if (copyListBrand.length <= maxLine * maxElementWithoutScroll) {
		while (copyListBrand.length) {
			let listPerLine = [];
			listPerLine = copyListBrand.splice(0, maxElementWithoutScroll);
			listSplit.push(listPerLine);
		}
	} else {
		let maxPerLine = copyListBrand.length / maxLine;
		let residualsPerLine = copyListBrand.length % maxLine;
		while (copyListBrand.length) {
			let listPerLine = [];
			if (residualsPerLine === 1) {
				listPerLine = copyListBrand.splice(0, maxPerLine + (copyListBrand.length % maxLine));
			}
			if (residualsPerLine === 2) {
				listPerLine = copyListBrand.splice(0, maxPerLine + 1);
			}

			listSplit.push(listPerLine);
		}
	}
	return listSplit;
};

export const CapitalizeText = (text: string) => {
	return text.charAt(0).toUpperCase() + text.slice(1);
};

export const truncateString = (text: string | number, limit: number) => {
	return text?.toString()?.length > limit
		? text.toString().slice(0, limit) + '...'
		: text.toString();
};

export const generatePrettyParams = (str: string) => {
	if (str.length) {
		if (['?', '&'].includes(str.slice(-1))) {
			return `?${str
				.substring(0, str.length - 1)
				.replace(/ /g, '+')
				.replace(/%20/g, '+')}`;
		} else return `?${str.replace(/ /g, '+').replace(/%20/g, '+')}`;
	} else return '';
};

export const convertObjToString = (object: Object) => {
	return Object.entries(object).reduce((str, [p, val]) => {
		if (typeof val === 'object') {
			return (str = str ? `${str},${p}:[${val}]` : `${p}:[${val}]`);
		} else {
			return (str = str ? `${str},${p}:${val}` : `${p}:${val}`);
		}
	}, '');
};

export const convertDateToString = (data: string) => {
	const nowDate = new Date();
	const estimateDate = new Date(data);
	const est = estimateDate.getDay() - nowDate.getDay();
	let result = '';
	switch (est) {
		case 0:
			result = 'hôm nay';
			break;
		case 1:
			result = 'ngày mai';
			break;
		case 2:
			result = 'ngày mốt';
			break;
		default:
			result = moment(data).format('DD/MM/YYYY');
			break;
	}
	return result;
};
