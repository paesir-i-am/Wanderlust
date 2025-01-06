import React, { useEffect, useState } from "react";
import { FiFilter, FiX } from "react-icons/fi"; // 필터 아이콘 및 X 아이콘 import
import "../scss/t_list/City.scss";
import { tourListApi } from "../../api/tourListApi";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCities } from "../../slice/tourListSlice";

const City = ({
  selectedCountry = null,
  selectedContinent = null,
  selectedCities = [], // props 추가
  onCitySelect,
}) => {
  const [citiesData, setCitiesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Redux store에서 selectedCities 가져오기
  const selectedCitiesFromStore = useSelector(
    (state) => state.tourListSlice?.selectedCities || [],
  );

  console.log("City selectedCities:", selectedCities);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedCountry) {
        setLoading(true);
        try {
          const response = await tourListApi.getContinentsCountriesCities();
          const countryData = response[selectedContinent]?.find((c) =>
            c.startsWith(selectedCountry.countryName),
          );
          if (countryData) {
            const [, citiesStr] = countryData.split(": ");
            setCitiesData(citiesStr.split(", "));
          }
        } catch (error) {
          console.error("도시 데이터 조회 실패:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setCitiesData([]);
        dispatch(setSelectedCities([]));
      }
    };
    fetchCities();
  }, [selectedCountry, selectedContinent, dispatch]);

  const handleCityClick = (city) => {
    const isCitySelected = selectedCitiesFromStore.some(
      (selectedCity) => selectedCity.cityName === city,
    );

    let newSelectedCities;
    if (isCitySelected) {
      // 이미 선택된 도시라면 제거
      newSelectedCities = selectedCitiesFromStore.filter(
        (selectedCity) => selectedCity.cityName !== city,
      );
    } else {
      // 선택되지 않은 도시라면 추가
      newSelectedCities = [
        ...selectedCitiesFromStore,
        { cityName: city, cityCodeName: city },
      ];
    }

    dispatch(setSelectedCities(newSelectedCities));
    onCitySelect(newSelectedCities);
  };

  const handleRemoveCity = (event, city) => {
    event.stopPropagation();
    const newSelectedCities = selectedCitiesFromStore.filter(
      (selectedCity) => selectedCity.cityName !== city,
    );

    dispatch(setSelectedCities(newSelectedCities));
    onCitySelect(newSelectedCities);
  };

  return (
    <div className="filter-container">
      <div className="filter-title">
        <FiFilter className="filter-icon" /> 도시 필터
      </div>
      <div className="selected-filters">
        {loading ? (
          <p>도시를 불러오는 중...</p>
        ) : citiesData.length > 0 ? (
          citiesData.map((city, index) => (
            <div
              key={index}
              onClick={() => handleCityClick(city)}
              className={`filter-item ${
                selectedCitiesFromStore.some(
                  (selectedCity) => selectedCity.cityName === city,
                )
                  ? "selected"
                  : ""
              }`}
            >
              {city}
              {selectedCitiesFromStore.some(
                (selectedCity) => selectedCity.cityName === city,
              ) && (
                <FiX
                  className="remove-icon"
                  onClick={(event) => handleRemoveCity(event, city)}
                />
              )}
            </div>
          ))
        ) : (
          <p>도시를 불러오려면 국가를 선택하세요.</p>
        )}
      </div>
    </div>
  );
};
export default City;
