export const useCoordinates = async (address?: string) => {
	try {
		const geocoder: any = new google.maps.Geocoder();
		const resp = await geocoder.geocode({ address: address });

		if (resp.results && resp.results.length) {
			return {
				lat: resp.results[0].geometry.location.lat(),
				lon: resp.results[0].geometry.location.lng(),
			};
		}

		return {};
	} catch (error) {
		return error;
	}
};
