export interface Slider {
	dots?: boolean;
	arrows?: boolean;
	slidesToShow?: number;
	slidesToScroll?: number;
	nextArrow?: Function;
	prevArrow?: Function;
	handleSlide?: Function;
	customPaging?: Function;
	speed?: number;
	autoplay?: boolean;
	autoplaySpeed?: number;
	classSlideDots?: string;
	classNameDots?: string;
	classSlide?: string;
	classPrevArrow?: string;
	classNextArrow?: string;
	disabledPrev?: boolean;
	disabledNext?: boolean;
	hiddenPrev?: boolean;
	hiddenNext?: boolean;
	stylePrevArrow?: Object;
	styleNextArrow?: Object;
	responsive?: Array<responsive>;
}
export interface responsive {
	breakpoint: number;
	settings: Slider;
}
export interface SlideInter {
	id: string | number;
	slide: Array<any>;
}
