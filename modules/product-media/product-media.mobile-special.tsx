import { ModalProductDetailMobile } from 'components';
import { IProductDetailProps } from 'models';
import { useState } from 'react';

interface IOpenModalDetail {
	defaultActiveImage: number;
	isActive: boolean;
}

const ProductMediaMobileSpecial: React.FC<IProductDetailProps> = ({
	productDetails,
}: IProductDetailProps) => {
	const [isOpenModalDetail, setIsOpenModalDetail] = useState<IOpenModalDetail>({
		defaultActiveImage: 1,
		isActive: false,
	});

	return (
		<div className='h-full w-full '>
			<div className='hide-scrollbar relative z-[60] h-full max-h-[60vh] w-full cursor-pointer overflow-y-scroll overflow-auto'>
				<ModalProductDetailMobile
					showModal={isOpenModalDetail}
					activeMode={'fastPreview'}
					dataSpecs={productDetails.content}
					dataProperties={productDetails.properties}
					dataMerchant={productDetails.merchant}
					dataSource={productDetails.images}
					extraData={productDetails}
					onClose={(): void =>
						setIsOpenModalDetail((prev) => ({ ...prev, defaultActiveImage: 1, isActive: false }))
					}
					onClick={setIsOpenModalDetail}
					videos={productDetails.videos.length !== 0 ? productDetails.videos : []}
				/>
			</div>
		</div>
	);
};

export default ProductMediaMobileSpecial;
