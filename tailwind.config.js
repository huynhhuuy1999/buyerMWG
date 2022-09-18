module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true,
	},
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./modules/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		fontFamily: {
			sfpro: ['SF Pro Display', 'Helvetica', 'sans-serif'],
			sfpro_bold: ['FProDisplay-Bold'],
			sfpro_semiBold: ['FProDisplay-semi-bold'],
		},
		screens: {
			xs: '320px',
			sm: '480px',
			md: '768px',
			lg: '976px',
			xl: '1440px',
			desktop: '1366px',
		},
		extend: {
			boxShadow: {
				profileCard: '0px 5px 10px 0px rgba(14, 14, 16, 0.06)',
				productCard:
					'9px 0 11px -6px rgba(220, 220, 220, 0.8), -9px 0 11px -6px rgba(220, 220, 220, 0.8)',
			},
			colors: {
				light: {
					F2F2F2: '#f2f2f2',
					F5F5F5: '#F5F5F5',
					F2E3FC: '#F2E3FC',
					F3F3F3: '#F3F3F3',
					FFFFFF: '#FFFFFF',
					E0E0E0: '#E0E0E0',
				},
				danger: {
					'7C254A': '#7C254A',
				},
				dark: {
					'9F9F9F': '#9F9F9F',
					666666: '#666666',
					'3E3E40': '#3E3E40',
					222222: '#222222',
					'3E3E40': '#3E3E40',
					'1A1A1C': '#1A1A1C',
					575758: '#575758',
					333333: '#333333',
				},
				orange: {
					FF7C5A: '#FF7C5A',
					ff7c59: '#ff7c59',
				},
				pink: {
					F05A94: '#F05A94',
				},
				primary: {
					'0088F9': '#0088F9',
					'009ADA': '#009ADA',
					'4834D6': '#4834D6',
				},
				'009ADA': '#009ADA',
				link: '#009ADA',
				222222: '#222222',
				DADDE1: '#DADDE1',
				F8F8F8: '#F8F8F8',
				'6E6E70': '#6E6E70',
				F05A94: '#F05A94',
				'3E3E40': '#3E3E40',
				FFC107: '#FFC107',
				666666: '#666666',
				DF0707: '#DF0707',
				828282: '#828282',
				FB6E2E: '#FB6E2E',
				E34400: '#E34400',
				FF7A00: '#FF7A00',
				FFE4D8: '#FFE4D8',
				'343A40': '#343A40',
				272728: '#272728',
				E7E7E8: '#E7E7E8',
				'0EB200': '#0EB200',
				'9F9F9F': '#9F9F9F',
				'4834D6': '#4834D6',
				EDF1F7: '#EDF1F7',
				F5F5F5: '#F5F5F5',
				EBEBEB: '#EBEBEB',
				D8D8D8: '#D8D8D8',
				'472F92': '#472F92',
				EA001B: '#EA001B',
				'1A94FF': '#1A94FF',
				'6200EE': '#6200EE',
				'7953D2': '#7953D2',
				999999: '#999999',
				'50009D': '#50009D',
				E5E5E5: '#E5E5E5',
				FFFFFF: '#FFFFFF',
				'7C254A': '#7C254A',
				757575: '#757575',
				414141: '#414141',
				'4527A0': '#4527A0',
				EFEDFC: '#EFEDFC',
				FEE800: '#FEE800',
				EB8A26: '#EB8A26',
				F2F2F2: '#F2F2F2',
				333333: '#333333',
				'black-60': '#6E6E70',
				'0001FC': '#0001FC',
				E0ECF8: '#E0ECF8',
				E3DEDE: '#E3DEDE',
				'7953d2': '#7953d2',
				FF2924: '#FF2924',
				'9E9E9E': '#9E9E9E',
				'5D4038': '#5D4038',
				FF570E: '#FF570E',
				FF9900: '#FF9900',
				'0E0E10': '#0E0E10',
			},
			flex: {
				'1/10': '0 0 10%',
				'1/15': '0 0 15%',
				'2/10': '0 0 20%',
				'3/15': '0 0 35%',
				'3/10': '0 0 30%',
				'4/10': '0 0 40%',
				'5/10': '0 0 50%',
				'6/10': '0 0 60%',
				'6/15': '0 0 65%',
				'7/10': '0 0 70%',
				'7/15': '0 0 75%',
				'8/10': '0 0 80%',
				'8/15': '0 0 85%',
				'9/10': '0 0 90%',
				'10/10': '0 0 100%',
				none: 'none',
			},
			fontSize: {
				10: '10px',
				11: '11px',
				12: '12px',
				13: '13px',
				14: '14px',
				16: '16px',
				18: '18px',
				20: '20px',
				22: '22px',
				24: '24px',
				26: '26px',
				28: '28px',
				32: '32px',
				36: '36px',
				48: '48px',
			},
			letterSpacing: {
				'0.0025em': '0.0025em',
			},
			borderRadius: {
				'3px': '3px',
				'4px': '4px',
				'6px': '6px',
				'20px': '20px',
				'100px': '100px',
			},
			borderWidth: {
				'1px': '1px',
				'2px': '2px',
				'3px': '3px',
				'4px': '4px',
				'5px': '5px',
				'6px': '6px',
				'9px': '9px',
				'10px': '10px',
				'13px': '13px',
				'14px': '14px',
				'15px': '15px',
				'16px': '16px',
				'17px': '17px',
				'18px': '18px',
				'21px': '21px',
				'23px': '23px',
				'29px': '29px',
				'31px': '31px',
				'34px': '34px',
				'38px': '38px',
				'40px': '40px',
			},
			lineHeight: {
				1.3: '1.3',
				13: '13px',
				24: '24px',
			},
			spacing: {
				'-2px': '2px',
				'1px': '1px',
				'2px': '2px',
				'3px': '3px',
				'4px': '4px',
				'5px': '5px',
				'6px': '6px',
				'7px': '7px',
				'9px': '9px',
				'10px': '10px',
				'13px': '13px',
				'14px': '14px',
				'15px': '15px',
				'17px': '17px',
				'18px': '18px',
				'21px': '21px',
				'23px': '23px',
				'29px': '29px',
				'31px': '31px',
				'34px': '34px',
				'38px': '38px',
				'40px': '40px',
				'43px': '43px',
				'45px': '45px',
				'46px': '46px',
				'50px': '50px',
				'51px': '51px',
				'61px': '61px',
				'66px': '66px',
				'70px': '70px',
				'75px': '75px',
				'85px': '85px',
				'91px': '91px',
				'122px': '122px',
				'124px': '124px',
				'131px': '131px',
				'157px': '157px',
				'170px': '170px',
				'171px': '171px',
				'177px': '177px',
				'179px': '179px',
				'207px': '207px',
				'230px': '230px',
				'217px': '217px',
				'252px': '252px',
				'269px': '269px',
				'298px': '298px',
				'314px': '314px',
				'665px': '665px',
				'688px': '688px',
				'696px': '696px',
				'2000px': '2000px',
			},
			maxWidth: {
				'120px': '120px',
				'160px': '160px',
				'1/10': '10%',
				'1/15': '15%',
				'2/10': '20%',
				'3/10': '30%',
				'3/15': '35%',
				'4/10': '40%',
				'5/10': '50%',
				'6/10': '60%',
				'6/15': '65%',
				'7/10': '70%',
				'7/15': '75%',
				'8/10': '80%',
				'8/15': '85%',
				'9/10': '90%',
				'10/10': '100%',
				container: '1105px',
			},
			height: {
				fill: '-webkit-fill-available',
				moz: '-moz-available',
			},
			maxHeight: {
				'397px': '397px',
			},
			width: {
				fill: '-webkit-fill-available',
				moz: '-moz-available',
			},
			minWidth: {
				'314px': '314px',
				container: '1105px',
			},
			padding: {
				'10px': '10px',
			},
			margin: {
				'10px': '10px',
			},
			opacity: {
				'54pc': '.54',
			},
			outline: {
				0: '0px',
				brandProduct: '3px solid #ffffff',
			},
			gridTemplateColumns: {
				13: 'repeat(13, minmax(0, 1fr))',
				14: 'repeat(14, minmax(0, 1fr))',
			},
			gap: {
				6.5: 1.625,
			},
		},
		container: {
			padding: {
				'3xl': '8.25rem',
			},
		},
	},
	variants: {
		extend: { cursor: ['hover', 'focus'] },
	},
	plugins: [require('@tailwindcss/line-clamp'), require('tailwind-scrollbar')],
};