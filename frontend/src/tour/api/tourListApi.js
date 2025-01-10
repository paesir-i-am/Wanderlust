import axiosInstance from "../../common/api/mainApi";

const BASE_URL = "/tour"; // baseURL이 이미 설정되어 있으므로 '/tour'만 사용
const prefix = `${BASE_URL}/list`;

export const tourListApi = {
  // 전체 데이터 조회 (대륙, 국가, 도시)
  getContinentsCountriesCities: async () => {
    try {
      const response = await axiosInstance.get(prefix, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all data:", error);
      throw error;
    }
  },

  // 필터링된 투어 리스트 조회
  getFilteredTourList: async (countryName, cityNames) => {
    try {
      if (Array.isArray(cityNames) && cityNames.length > 0) {
        const promises = cityNames.map(async (cityName) => {
          const response = await axiosInstance.get(prefix, {
            params: { countryName, cityName },
          });
          return response.data || [];
        });

        const results = await Promise.all(promises);
        const combinedResults = results.flat();
        const uniqueResults = Array.from(
          new Map(combinedResults.map((item) => [item.tourId, item])).values(),
        );

        console.log("Received combined response from backend:", uniqueResults);
        return uniqueResults;
      }

      const response = await axiosInstance.get(prefix, {
        params: {
          countryName,
          cityName: Array.isArray(cityNames) ? null : cityNames,
        },
      });
      console.log("Received response from backend:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching filtered tour list:", error);
      throw error;
    }
  },

  // 랜덤 여행지 리스트 조회
  getRandomTourList: async (count = 3) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/random`, {
        params: { count },
        withCredentials: true,
      });
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching random tour list:", error);
      throw error;
    }
  },

  // 구글 맵 데이터 조회
  getGoogleMap: async (tourId) => {
    try {
      const response = await axiosInstance.get("/api/googlemap/all");
      console.log("Received all google map data:", response.data);

      // 데이터 구조 디버깅
      response.data.forEach((item, index) => {
        console.log(`Item ${index}:`, item);
      });

      // tourId로 데이터 매칭
      const mapData = response.data.find(
        (item) =>
          item.tourList && String(item.tourList.tourId) === String(tourId), // 타입 맞추기
      );

      if (!mapData) {
        console.error("No matching map data found for tourId:", tourId);
        throw new Error("No data found for the given tourId");
      }

      console.log("Filtered google map data:", mapData);

      return {
        latitude: mapData.latitude,
        longitude: mapData.longitude,
      };
    } catch (error) {
      console.error("Error fetching google map data:", error);
      throw error;
    }
  },

  // cityName으로 tourId 반환
  getTourIdsByCityName: async (cityName) => {
    try {
      console.log("Sending request to:", `${BASE_URL}/read/city/${cityName}`); // 디버깅
      console.log("Request parameter cityName:", cityName); // 디버깅
      const response = await axiosInstance.get(
        `${BASE_URL}/read/city/${cityName}`,
      );
      console.log("Response data:", response.data); // 응답 데이터 확인
      return response.data;
    } catch (error) {
      console.error("Error fetching tour IDs by city name:", error);
      throw error;
    }
  },

  getTourById: async (tourId) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/read/${tourId}`);
      console.log("Axios response:", response.data); // 응답 데이터 출력
      return response.data;
    } catch (error) {
      console.error("Error fetching tour by ID:", error);
      throw error;
    }
  },
};
