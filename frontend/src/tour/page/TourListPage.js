import React, { useCallback, useEffect, useMemo } from "react";
import "../page/scss/TourListPage.scss";
import BasicLayout from "../../common/layout/basicLayout/BasicLayout";
import { tourListApi } from "../api/tourListApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedContinent,
  setSelectedCountry,
  setSelectedCities,
  setTourList,
  setTotalItems,
} from "../slice/tourListSlice";
import Continent from "../component/t_list/Continent";
import Country from "../component/t_list/Country";
import City from "../component/t_list/City";
import TourList from "../component/t_list/TourList";
import PageComponent from "../component/common/PageComponent";
import ModelLoader_origin from "../component/common/ModelLoader_origin";

const TourListPage = () => {
  const dispatch = useDispatch();

  const tourListState = useSelector((state) => state.tourListSlice || {});

  // 구조 분해로 상태를 가져옵니다.
  const {
    selectedContinent = null,
    selectedCountry = null,
    selectedCities = [],
    tourList = [],
    totalItems = 0,
  } = tourListState;

  // selectedCities를 메모이제이션
  const memoizedSelectedCities = useMemo(
    () => selectedCities,
    [selectedCities],
  );

  const fetchTourList = useCallback(
    async (countryName, cities) => {
      try {
        if (!countryName) return;

        let response;
        if (!cities || cities.length === 0) {
          response = await tourListApi.getFilteredTourList(countryName, null);
        } else {
          response = await tourListApi.getFilteredTourList(
            countryName,
            cities.map((city) => city.cityName),
          );
        }

        dispatch(setTourList(response || []));
        dispatch(setTotalItems(response.length || 0));
      } catch (error) {
        console.error("Failed to fetch tour list:", error);
      }
    },
    [dispatch],
  );

  // 기본값 설정: "국내" 데이터를 로드
  useEffect(() => {
    const initializeDefaultData = async () => {
      try {
        // "국내" 기본값 설정
        const defaultContinent = "국내";
        const defaultCountry = { countryName: "한국", countryCodeName: "KR" };

        // 대륙, 국가 설정
        dispatch(setSelectedContinent(defaultContinent));
        dispatch(setSelectedCountry(defaultCountry));

        // 여행지 목록 로드
        await fetchTourList(defaultCountry.countryName, []);
      } catch (error) {
        console.error("Failed to initialize default data:", error);
      }
    };

    // 처음 렌더링될 때만 실행되도록 빈 배열([])로 설정
    if (!selectedContinent && !selectedCountry) {
      initializeDefaultData();
    }
  }, [dispatch, fetchTourList, selectedContinent, selectedCountry]);

  const handleContinentSelect = (continent) => {
    // 다른 대륙 선택 시 "국내" 기본값 충돌 방지
    dispatch(setSelectedContinent(continent));
    dispatch(setSelectedCountry(null));
    dispatch(setSelectedCities([]));
    dispatch(setTourList([]));
  };

  return (
    <BasicLayout>
      <div className="list-page">
        <div className="top-container">
          <div className="country-box">
            <Continent
              selectedContinent={selectedContinent}
              onContinentSelect={handleContinentSelect}
            />
          </div>
        </div>

        <div className="content-container">
          <div className="category-box">
            <Country
              continentName={selectedContinent}
              selectedCountry={selectedCountry}
              onCountrySelect={(country) => {
                dispatch(setSelectedCountry(country));
                dispatch(setSelectedCities([]));
              }}
            />
          </div>

          <div className="list-container">
            <City
              selectedCities={memoizedSelectedCities || []} // 기본값 추가
              selectedCountry={selectedCountry || null}
              selectedContinent={selectedContinent || null}
              onCitySelect={(cities) => {
                dispatch(setSelectedCities(cities || [])); // 기본값 추가
              }}
            />

            <TourList
              tourList={tourList || []} // 기본값 추가
              selectedCountry={selectedCountry || null}
              selectedCities={memoizedSelectedCities || []} // 기본값 추가
            />

            <PageComponent
              pageRequest={{
                continentName: selectedContinent,
                countryCodeName: selectedCountry?.countryCode,
                cityCodeNames: memoizedSelectedCities.map(
                  (city) => city.cityCodeName,
                ), // 배열로 변경
              }}
              totalItems={totalItems}
              onPageChange={(newPage) => {
                console.log(`Page changed to: ${newPage}`); // 백틱으로 수정
              }}
            />
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default TourListPage;
