import React, { useCallback, useEffect } from "react";
import { Link } from "react-router-dom"; // Link를 import
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
} from "../slice/tourListSlice"; // Redux Slice
import { FiStar } from "react-icons/fi";
import Continent from "../component/t_list/Continent";
import Country from "../component/t_list/Country";
import City from "../component/t_list/City";
import TourList from "../component/t_list/TourList";
import PageComponent from "../component/common/PageComponent";

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
    likedTours = [],
  } = tourListState;

  console.log("TourListPage selectedCities:", tourListState.selectedCities);
  console.log("TourListPage likedTours:", tourListState.likedTours);

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

  useEffect(() => {
    if (selectedCountry) {
      fetchTourList(selectedCountry?.countryName || null, selectedCities || []);
    }
  }, [selectedCountry, selectedCities, fetchTourList]);

  const handleContinentSelect = (continent) => {
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
          <Link to="/tour/like" className="likes-box">
            <FiStar className="like-icon" /> 좋아요 페이지
          </Link>
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
              selectedCities={selectedCities || []} // 기본값 추가
              selectedCountry={selectedCountry || null}
              selectedContinent={selectedContinent || null}
              onCitySelect={(cities) => {
                dispatch(setSelectedCities(cities || [])); // 기본값 추가
              }}
            />

            <TourList
              tourList={tourList || []} // 기본값 추가
              likedTours={likedTours || []} // 기본값 추가
              selectedCountry={selectedCountry || null}
              selectedCities={selectedCities || []} // 기본값 추가
            />

            <PageComponent
              pageRequest={{
                continentName: selectedContinent,
                countryCodeName: selectedCountry?.countryCode,
                cityCodeNames: selectedCities.map((city) => city.cityCodeName), // 배열로 변경
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
