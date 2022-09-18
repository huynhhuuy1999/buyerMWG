import { STATUS_NOTI, TYPE_NOTI } from './constant';

export const listMockup = [
	{
		id: 1,
		icon: '/static/svg/promotions.svg',
		content:
			'Từ 29/2/2022, VuiVui miễn phí giao tiêu chuẩn cho đơn hàng từ 500k, áp dụng phí 19k cho đơn hàng dưới 500k. Thay đổi áp dụng cho khách hàng không phải là thành viên VuiVui.',
		time: '23/02/2022',
		type: TYPE_NOTI.PROMOTION,
		status: STATUS_NOTI.UNREAD,
	},
	{
		id: 2,
		icon: '/static/svg/shopping-cart.svg',
		content:
			'Từ ngày 26/06/2022, VuiVui áp dụng phí vận chuyển dựa trên khối lượng/ kích thước đóng gói của các sản phẩm trong đơn hàng, và khoảng cách giữa địa chỉ nhận hàng và kho của VuiVui/nhà cung cấp/nhà bán hàng. Quý khách có thể kiểm tra phí ở bước "Thanh toán và đặt mua". Chương trình ưu đãi phí giao hàng của sàn VuiVui sẽ được cập nhật tại phần "Thông báo của tôi" vào mỗi tháng (áp dụng cho giao hàng tiêu chuẩn)',
		time: '26/06/2022',
		type: TYPE_NOTI.ORDER,
		status: STATUS_NOTI.UNREAD,
	},
	{
		id: 3,
		icon: '/static/svg/system.svg',
		content:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae dolorum, tempora quo quod laborum illum! Quaerat non maxime tenetur nihil ea delectus repellat praesentium eos quos? A labore eveniet corporis.',
		time: '24/02/2022',
		type: TYPE_NOTI.SYSTEM,
		status: STATUS_NOTI.UNREAD,
	},
	{
		id: 4,
		icon: '/static/svg/system.svg',
		content:
			'Hãy thay đổi mật khẩu thường xuyên để nâng cao bảo mật. Ngoài ra: 1) Không nên sử dụng chung mật khẩu của email với mật khẩu của các tài khoản khác. 2) Luôn đăng xuất khỏi các tài khoản sau khi sử dụng trên thiết bị công cộng hoặc thiết bị không phải của bản thân.',
		time: '23/03/2022',
		type: TYPE_NOTI.SYSTEM,
		status: STATUS_NOTI.UNREAD,
	},
	{
		id: 5,
		icon: '/static/svg/shopping-cart.svg',
		content:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae dolorum, tempora quo quod laborum illum! Quaerat non maxime tenetur nihil ea delectus repellat praesentium eos quos? A labore eveniet corporis.',
		time: '25/03/2022',
		type: TYPE_NOTI.ORDER,
		status: STATUS_NOTI.UNREAD,
	},
	{
		id: 6,
		icon: '/static/svg/shopping-cart.svg',
		content:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae dolorum, tempora quo quod laborum illum! Quaerat non maxime tenetur nihil ea delectus repellat praesentium eos quos? A labore eveniet corporis.',
		time: '22/05/2022',
		type: TYPE_NOTI.ORDER,
		status: STATUS_NOTI.UNREAD,
	},
	{
		id: 7,
		icon: '/static/svg/promotions.svg',
		content:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae dolorum, tempora quo quod laborum illum! Quaerat non maxime tenetur nihil ea delectus repellat praesentium eos quos? A labore eveniet corporis.',
		time: '22/05/2022',
		type: TYPE_NOTI.PROMOTION,
		status: STATUS_NOTI.UNREAD,
	},
	{
		id: 8,
		icon: '/static/svg/promotions.svg',
		content:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae dolorum, tempora quo quod laborum illum! Quaerat non maxime tenetur nihil ea delectus repellat praesentium eos quos? A labore eveniet corporis.',
		time: '22/05/2022',
		type: TYPE_NOTI.PROMOTION,
		status: STATUS_NOTI.UNREAD,
	},
];
