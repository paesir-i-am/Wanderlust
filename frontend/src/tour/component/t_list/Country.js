import React, { useEffect, useState } from "react";
import "../scss/t_list/Country.scss";
import { FiCircle, FiCheckCircle, FiAlignLeft } from "react-icons/fi";
import { tourListApi } from "../../api/tourListApi";

const Country = ({ continentName, selectedCountry, onCountrySelect }) => {
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      if (continentName) {
        setLoading(true);

        try {
          const response = await tourListApi.getContinentsCountriesCities();
          console.log("API Response for Continent:", response);
          console.log(
              "Countries for selected continent:",
              response[continentName],
          );

          const countries = response[continentName] || [];
          setCountriesData(
              countries.map((country, index) => {
                const [countryName, cities] = country.split(": "); // '괌: 괌' 형태 처리
                return {
                  id: `${countryName}-${index}`, // 고유 ID 생성
                  countryName,
                  countryCodeName: countryName, // 고유 코드로 활용 가능
                  cities: cities ? cities.split(", ") : [], // 도시 데이터 파싱
                };
              }),
          );
        } catch (error) {
          console.error("Failed to fetch countries data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setCountriesData([]);
      }
    };

    fetchCountries();
  }, [continentName]);

  if (loading) return <p>국가 목록을 불러오는 중...</p>;

  return (
      <div className="country-category-container">
        <div className="country-filter-title">
          국가 <FiAlignLeft className="filter-icon" />
        </div>
        <div className="country-category-list">
          {countriesData.map((country) => (
              <div
                  key={country.id} // 고유 키로 `id` 사용
                  onClick={() => onCountrySelect(country)}
                  className={`country-category-item ${
                      selectedCountry?.countryCodeName === country.countryCodeName
                          ? "selected"
                          : ""
                  }`}
              >
                {selectedCountry?.countryCodeName === country.countryCodeName ? (
                    <FiCheckCircle className="icon" />
                ) : (
                    <FiCircle className="icon" />
                )}
                <span className="text">{country.countryName}</span>
              </div>
          ))}
        </div>
      </div>
  );
};

export default Country;
