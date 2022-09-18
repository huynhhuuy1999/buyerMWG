enum CategorySortEnum {
	/// Tạo mới nhất
	LATEST_CREATED = 0,
	/// Tạo cũ nhất
	OLDEST_CREATED = 1,
	/// cập nhật mới nhất
	LATEST_UPDATED = 2,
	/// cập nhật cũ nhất
	OLDEST_UPDATED = 3,
	/// Theo giá giảm dần
	PRICE_DESC = 4,
	/// Theo giá tăng dần
	PRICE_ASC = 5,
	/// Sản phẩm đã like
	PRODUCT_LIKED = 6,
}

export const dataSortDropdown = [
	{
		id: 0,
		label: 'Mặc định',
	},
	{
		id: 1,
		label: 'Theo giá giảm dần',
	},
	{
		id: 2,
		label: 'Theo giá tăng dần',
	},
	{
		id: 3,
		label: '% giảm giá giảm dần',
	},
	{
		id: 4,
		label: 'Sản phẩm mới nhất',
	},
	{
		id: 5,
		label: 'Bán chạy nhất',
	},
	{
		id: 6,
		label: 'Được yêu thích nhiều nhất',
	},
];

export const dataSortDropdownAll = [
	{
		id: CategorySortEnum.LATEST_CREATED,
		label: 'Ngày tạo mới nhất',
		selected: true,
	},
	{
		id: CategorySortEnum.OLDEST_CREATED,
		label: 'Ngày tạo cũ nhất',
		selected: false,
	},
	{
		id: CategorySortEnum.LATEST_UPDATED,
		label: 'Cập nhật mới nhất',
		selected: false,
	},
	{
		id: CategorySortEnum.OLDEST_UPDATED,
		label: 'Cập nhật cũ nhất',
		selected: false,
	},
	{
		id: CategorySortEnum.PRICE_DESC,
		label: 'Theo giá giảm dần',
		selected: false,
	},
	{
		id: CategorySortEnum.PRICE_ASC,
		label: 'Thao giá tăng dần',
		selected: false,
	},
	{
		id: CategorySortEnum.PRODUCT_LIKED,
		label: 'Sản phẩm đã thích',
		selected: false,
	},
];
