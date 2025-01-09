import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchFlights } from "../api/pythonapi";
import { getAllFlightData } from "../api/flightapi";
import "../styles/FlightSearch.scss";
import LoadingPage from "../components/LoadingPage";

const FlightSearch = ({ activeOption, setActiveOption }) => {
  const navigate = useNavigate();
  const [departureAirport, setDepartureAirport] = useState("ICN");
  const [arrivalAirport, setArrivalAirport] = useState("NRT");
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [adult, setAdult] = useState(0);
  const [child, setChild] = useState(0);
  const [infant, setInfant] = useState(0);
  const [fareType, setFareType] = useState("Y");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [departureDropdownOpen, setDepartureDropdownOpen] = useState(false);
  const [arrivalDropdownOpen, setArrivalDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const airportOptions = [
    { code: "ICN", name: "인천" },
    { code: "NRT", name: "도쿄_나리타" },
    { code: "CJU", name: "제주도" },
    { code: "HND", name: "도쿄_하네다" },
    { code: "KIX", name: "오사카" },
    { code: "FUK", name: "후쿠오카" },
    { code: "OKA", name: "오키나와" },
    { code: "NGO", name: "나고야" },
    { code: "TAO", name: "청두" },
    { code: "PVG", name: "상하이" },
    { code: "HRB", name: "하얼빈" },
    { code: "HKG", name: "홍콩" },
  ];

  const fareOptions = [
    { code: "Y", label: "일반석" },
    { code: "C", label: "비즈니스석" },
    { code: "F", label: "일등석" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".flight-dropdown") && dropdownOpen) {
        setDropdownOpen(false);
      }
      if (!event.target.closest(".flight-dropdown1") && departureDropdownOpen) {
        setDepartureDropdownOpen(false);
      }
      if (!event.target.closest(".flight-dropdown2") && arrivalDropdownOpen) {
        setArrivalDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen, departureDropdownOpen, arrivalDropdownOpen]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}${month}${day}`;
  };

  const swapAirports = () => {
    setDepartureAirport((prevDeparture) => {
      setArrivalAirport(prevDeparture);
      return arrivalAirport;
    });
  };

  const handleDropdownToggle = (dropdown) => {
    if (dropdown === "departure") {
      setDepartureDropdownOpen((prev) => !prev);
      setArrivalDropdownOpen(false);
      setDropdownOpen(false);
    } else if (dropdown === "arrival") {
      setArrivalDropdownOpen((prev) => !prev);
      setDepartureDropdownOpen(false);
      setDropdownOpen(false);
    } else if (dropdown === "passenger") {
      setDropdownOpen((prev) => !prev);
      setDepartureDropdownOpen(false);
      setArrivalDropdownOpen(false);
    }
  };

  const handleSearch = async () => {
    if (!departureDate || (activeOption === "왕복" && !arrivalDate)) {
      alert("출발 날짜와 도착 날짜를 입력해주세요!");
      return;
    }

    const formattedDepartureDate = formatDate(departureDate);
    const formattedArrivalDate =
      activeOption === "왕복" ? formatDate(arrivalDate) : "";

    const convertedTripType = activeOption === "왕복" ? "RT" : "OW";
    const totalPassengers = adult + child + infant;
    const payload = {
      departureAirport,
      arrivalAirport,
      departureDate: formattedDepartureDate,
      arrivalDate: formattedArrivalDate,
      tripType: convertedTripType,
      adult,
      child,
      infant,
      totalPassengers, // 총 인원 추가
      fareType,
    };
    console.log("Payload to Backend:", payload);


    setLoading(true);

    const retryDelay = 2000;

    const fetchFlightDataUntilSuccess = async (attempt = 1) => {
      try {
        const pythonResponse = await searchFlights(payload);
        const backendResponse = await getAllFlightData();

        if (backendResponse.schedules && backendResponse.schedules.length > 0) {
          navigate("/flight/result", {
            state: {
              searchInfo: {
                departure: airportOptions.find(
                  (option) => option.code === departureAirport
                )?.name,
                departureCode: departureAirport,
                arrival: airportOptions.find(
                  (option) => option.code === arrivalAirport
                )?.name,
                arrivalCode: arrivalAirport,
                dates:
                  activeOption === "왕복"
                    ? `${departureDate} ~ ${arrivalDate}`
                    : `${departureDate}`,
                passengers: `성인 ${adult}명, 소아 ${child}명, 유아 ${infant}명, ${
                  fareOptions.find((f) => f.code === fareType)?.label || ""
                }`,
                adult, // 성인 인원 추가
                child, // 소아 인원 추가
                infant, // 유아 인원 추가
                totalPassengers,
              },
              results: {
                schedules: backendResponse.schedules,
                fares: backendResponse.fares,
                airlines: backendResponse.airlines,
                airports: backendResponse.airports,
              },
            },
          });


          setLoading(false);
        } else {
          setTimeout(
            () => fetchFlightDataUntilSuccess(attempt + 1),
            retryDelay
          );
        }
      } catch (error) {
        setTimeout(() => fetchFlightDataUntilSuccess(attempt + 1), retryDelay);
      }
    };

    fetchFlightDataUntilSuccess();
  };

  return (
    <div className="flight-search">
      <div className="flight-search-container">
        {loading && <LoadingPage />}

        <div className="flight-options">
          {["왕복", "편도"].map((option) => (
            <button
              key={option}
              className={activeOption === option ? "active" : ""}
              onClick={() => setActiveOption(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flight-fields">
          <div className="flight-dropdown1">
            <button
              className="flight-dropdown-toggle"
              onClick={() => handleDropdownToggle("departure")}
            >
              {airportOptions.find((option) => option.code === departureAirport)
                ?.name || "출발 공항"}
            </button>
            {departureDropdownOpen && (
              <div className="flight-dropdown-menu">
                {airportOptions.map((option) => (
                  <button
                    key={option.code}
                    onClick={() => {
                      setDepartureAirport(option.code);
                      setDepartureDropdownOpen(false);
                    }}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span onClick={swapAirports} style={{ cursor: "pointer" }}>
            ⇌
          </span>

          <div className="flight-dropdown2">
            <button
              className="flight-dropdown-toggle"
              onClick={() => handleDropdownToggle("arrival")}
            >
              {airportOptions.find((option) => option.code === arrivalAirport)
                ?.name || "도착 공항"}
            </button>
            {arrivalDropdownOpen && (
              <div className="flight-dropdown-menu">
                {airportOptions.map((option) => (
                  <button
                    key={option.code}
                    onClick={() => {
                      setArrivalAirport(option.code);
                      setArrivalDropdownOpen(false);
                    }}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
          {activeOption === "왕복" && (
            <input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
            />
          )}

          <div className="flight-dropdown">
            <button
              className="flight-dropdown-toggle"
              onClick={() => handleDropdownToggle("passenger")}
            >
              성인 {adult}명,{" "}
              {fareOptions.find((f) => f.code === fareType)?.label}
            </button>
            {dropdownOpen && (
              <div className="flight-dropdown-menu">
                <div className="passenger-section">
                  {[
                    { label: "성인", count: adult, setCount: setAdult, min: 1 },
                    { label: "소아", count: child, setCount: setChild, min: 0 },
                    {
                      label: "유아",
                      count: infant,
                      setCount: setInfant,
                      min: 0,
                    },
                  ].map(({ label, count, setCount, min }) => (
                    <div className="row" key={label}>
                      <span>{label}</span>
                      <div className="controls">
                        <button
                          onClick={() =>
                            setCount((prev) => Math.max(prev - 1, min))
                          }
                        >
                          -
                        </button>
                        <span>{count}</span>
                        <button onClick={() => setCount((prev) => prev + 1)}>
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="fare-section">
                  {fareOptions.map((option) => (
                    <button
                      key={option.code}
                      className={fareType === option.code ? "active" : ""}
                      onClick={() => setFareType(option.code)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={handleSearch} disabled={loading}>
            {loading ? "검색 중..." : "검색"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
