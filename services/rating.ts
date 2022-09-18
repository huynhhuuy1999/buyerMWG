import request from 'utils/request';
// import { QueryParams } from 'models';

export const getRatingStarProductWithId = (id: number): Promise<any> => {
	return request({
		url: `/rating/star/${id}`,
		method: 'GET',
	});
};
export const postRating = (id: number): Promise<any> => {
	return request({
		url: `/rating/star/${id}`,
		method: 'GET',
	});
};
