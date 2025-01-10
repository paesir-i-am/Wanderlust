import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { tourListApi } from "../../api/tourListApi";
import "../scss/t_list/Continent.scss";

const Continent = ({ onContinentSelect, selectedContinent }) => {
  const [continentsData, setContinentsData] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchContinents = async () => {
      try {
        const response = await tourListApi.getContinentsCountriesCities();
        setContinentsData(response || {});
      } catch (error) {
        console.error("대륙 데이터 조회 실패:", error);
      }
    };
    fetchContinents();
  }, []);

  return (
      <div className="continent-component">
        <div
            className="continent-box"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedContinent || "카테고리"}
          <FiChevronDown className="dropdown-icon" />
        </div>
        {isDropdownOpen && (
            <div className="dropdown-menu">
              {Object.keys(continentsData).map((continent) => (
                  <div
                      className="dropdown-item"
                      key={continent}
                      onClick={() => {
                        onContinentSelect(continent);
                        setIsDropdownOpen(false);
                      }}
                  >
                    {continent}
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default Continent;
