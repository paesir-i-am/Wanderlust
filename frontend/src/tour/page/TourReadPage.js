import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BasicLayout from "../../common/layout/basicLayout/BasicLayout";
import "../page/scss/TourReadPage.scss";
import Random from "../component/t_list/Random";
import Category from "../component/map/Category";
import PlaceList from "../component/map/PlaceList";
import Map from "../component/map/Map";
import { tourListApi } from "../api/tourListApi";

const TourReadPage = () => {
  const { tourId } = useParams();
  const { state } = useLocation();
  const { selectedTour, lat, lng } = state || {}; // selectedTour와 lat, lng 받아오기
  const navigate = useNavigate();

  // Google Maps 상태 관리
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9783 }); // 기본 서울 위치
  const [currentLocation, setCurrentLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [category, setCategory] = useState("");
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [travelMode, setTravelMode] = useState("TRANSIT");
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [tourDetails, setTourDetails] = useState(selectedTour || null); // 중복 state 제거

  // tourid값으로 상세 정보 검색
  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        console.log("Fetching details for tourId:", tourId);

        // 1. Tour 상세 정보 가져오기
        if (!tourDetails && tourId) {
          const details = await tourListApi.getTourById(tourId);
          console.log("Tour details fetched:", details);
          setTourDetails(details);

          // 2. Google Map 데이터 가져오기
          const mapData = await tourListApi.getGoogleMap(tourId);
          console.log("Google map data fetched:", mapData);

          setCenter({
            lat: mapData.latitude || 37.5665,
            lng: mapData.longitude || 126.9783,
          });
        }
      } catch (error) {
        console.error("Error fetching tour details:", error);
      }
    };

    fetchTourDetails();
  }, [tourId, tourDetails]);

  // 구글 맵에 표시할 장소들 가져오기
  const fetchPlaces = (tourId) => {
    axios
      .get("http://localhost:8080/api/googlemap/all")
      .then((response) => {
        const allPlaces = response.data;
        const tourPlace = allPlaces.find(
          (place) => place.tourList.tourId === parseInt(tourId),
        );

        if (tourPlace) {
          const { latitude, longitude } = tourPlace;
          const location = { lat: latitude, lng: longitude };

          // 현재 위치가 이미 설정되었으면 변경하지 않도록 처리
          if (!currentLocation) {
            setCurrentLocation(location); // 한 번만 설정
            setCenter(location); // 지도 중심을 해당 위치로 설정
            setPlaces([tourPlace]); // 해당 여행지의 장소를 places 상태에 설정
          }
        }
      })
      .catch((error) => {
        console.error("장소 정보를 불러오는 데 실패했습니다:", error);
      });
  };

  const handleAdditionalTourClick = (tour) => {
    navigate(`/tour/read/${tour.tourId}`, {
      state: {
        selectedTour: tour, // 전체 tour 객체 전달
        lat: tour.latitude || 37.5665, // 여행지의 위도
        lng: tour.longitude || 126.9783, // 여행지의 경도
      },
    });
  };

  // 거리 계산 함수
  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    if (!window.google) return 0;
    const point1 = new window.google.maps.LatLng(lat1, lng1);
    const point2 = new window.google.maps.LatLng(lat2, lng2);
    return window.google.maps.geometry.spherical.computeDistanceBetween(
      point1,
      point2,
    );
  }, []);

  const calculateAndShowRoute = (place) => {
    if (!map || !currentLocation || !place.geometry) return;

    const directionsService = new window.google.maps.DirectionsService();

    // 이전에 그린 경로 초기화
    if (directionsRenderer) {
      directionsRenderer.setMap(null); // 이전 경로 제거
    }

    // 새로운 DirectionsRenderer 생성
    const newDirectionsRenderer = new window.google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true, // 기본 마커 숨김
      polylineOptions: {
        strokeColor: "#FF0000", // 빨간색 선으로 설정
        strokeWeight: 10, // 선의 두께를 10으로 설정 (더 두껍게)
        strokeOpacity: 0.8, // 선의 투명도 설정 (0은 완전 투명, 1은 불투명)
      },
    });

    const origin = currentLocation; // 출발지 (현재 위치)
    const destination = place.geometry.location; // 도착지 (목적지)

    // 대중교통 경로를 계산할 수 있는지 여부를 확인하는 함수
    const canUseTransit = (lat, lng) => {
      // 여기에 특정 도시나 국가에 대해 대중교통이 지원되는지 여부를 체크하는 조건을 추가할 수 있습니다.
      // 예를 들어, 특정 국가에서는 대중교통을 지원하지 않으므로 기본적으로 'false'로 설정.
      return lat >= 33.0 && lat <= 38.5 && lng >= 126.0 && lng <= 130.0; // 예시: 대한민국 범위
    };

    // 대중교통을 사용할지 여부 결정
    const isDomestic =
      canUseTransit(currentLocation.lat, currentLocation.lng) &&
      canUseTransit(
        place.geometry.location.lat(),
        place.geometry.location.lng(),
      );

    const request = {
      origin: origin,
      destination: destination,
      travelMode: isDomestic
        ? window.google.maps.TravelMode.TRANSIT
        : window.google.maps.TravelMode.DRIVING, // 국내일 때만 대중교통 사용
      transitOptions: isDomestic
        ? {
            modes: [window.google.maps.TransitMode.SUBWAY], // 대중교통 모드 (지하철)
            routingPreference:
              window.google.maps.TransitRoutePreference.FEWER_TRANSFERS, // 최소 환승 경로 선호
          }
        : undefined, // 대중교통이 불가능한 경우는 옵션 제거
    };

    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        newDirectionsRenderer.setDirections(result);
        setDirectionsRenderer(newDirectionsRenderer); // 새로운 directionsRenderer 설정
      } else {
        // 대중교통 경로 실패 시 대체 경로(자동차 모드) 시도
        if (status === window.google.maps.DirectionsStatus.ZERO_RESULTS) {
          alert("해당 경로는 대중교통으로 찾을 수 없습니다.");
          // 대체 경로: 자동차 모드로 변경
          request.travelMode = window.google.maps.TravelMode.DRIVING; // 자동차 모드로 변경
          directionsService.route(request, (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              newDirectionsRenderer.setDirections(result);
              setDirectionsRenderer(newDirectionsRenderer); // 새로운 directionsRenderer 설정
            } else {
              alert("자동차 경로를 찾을 수 없습니다.");
            }
          });
        } else if (
          status === window.google.maps.DirectionsStatus.OVER_QUERY_LIMIT
        ) {
          alert("쿼리 제한을 초과했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          alert("경로 계산 실패: " + status); // 다른 상태별 메시지
        }
      }
    });
  };

  // Google Maps API 로드 확인 및 초기화
  const checkGoogleMapsLoaded = useCallback(() => {
    if (window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
      return true;
    }
    return false;
  }, []);

  // 장소 검색 함수
  const findPlaces = useCallback(
    (selectedCategory = "", newCenter = center) => {
      if (!checkGoogleMapsLoaded()) return;
      const service = new window.google.maps.places.PlacesService(map);
      const request = {
        location: new window.google.maps.LatLng(newCenter.lat, newCenter.lng),
        radius: 5000,
        type: selectedCategory || "tourist_attraction",
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const placesWithDistance = results.map((place) => {
            let distance = 0;
            if (currentLocation) {
              const placeLat = place.geometry.location.lat();
              const placeLng = place.geometry.location.lng();
              distance = calculateDistance(
                currentLocation.lat,
                currentLocation.lng,
                placeLat,
                placeLng,
              );
            }
            return { ...place, distance };
          });

          setPlaces(placesWithDistance); // 받아온 장소 데이터를 places 상태에 설정
        } else {
          console.error("Nearby search failed with status:", status);
        }
      });
    },
    [googleMapsLoaded, currentLocation, center, calculateDistance, map],
  );

  // 여행지 클릭 시 해당 위치로 이동하는 함수
  const handlePlaceClick = (place) => {
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    // 기존 위치가 없을 경우만 현재 위치를 설정
    if (!currentLocation) {
      setCurrentLocation(location);
    }
    setCenter(location);
    map.panTo(location);
    calculateAndShowRoute(place);
  };

  // `tourId`에 맞는 장소 정보 초기화
  useEffect(() => {
    if (tourId && googleMapsLoaded) {
      fetchPlaces(tourId); // 장소 가져오기
    }
  }, [tourId, googleMapsLoaded]);

  // Google Maps API 로드 확인 및 초기화
  useEffect(() => {
    const interval = setInterval(() => {
      if (checkGoogleMapsLoaded() && !initialized) {
        setInitialized(true);
        if (currentLocation && category) {
          findPlaces(category, currentLocation);
        }
        clearInterval(interval);
      }
    }, 100);
  }, [
    checkGoogleMapsLoaded,
    initialized,
    currentLocation,
    category,
    findPlaces,
  ]);

  return (
    <BasicLayout>
      <div className="page-container">
        {selectedTour ? (
          <div className="content-grid">
            <div className="left-content">
              <div className="city-img-container">
                <img
                  src={tourDetails.cityImg}
                  alt={tourDetails.tourTitle}
                  className="city-img"
                />
              </div>
              <div className="title-section">
                <h2 className="tour-title">{tourDetails.tourTitle}</h2>
                <div className="tour-description">
                  <p className="city-name">{tourDetails.cityName}</p>
                  <p>{tourDetails.tourContext}</p>
                </div>
              </div>
            </div>
            <div className="map-container">
              <Map
                center={center}
                places={places}
                currentLocation={currentLocation}
                setActiveMarker={setActiveMarker}
                travelMode={travelMode}
                calculateAndShowRoute={findPlaces}
                setMap={setMap}
              />
            </div>
            <div className="category-section">
              <Category onCategoryClick={findPlaces} />
            </div>
            <div className="place-list">
              <PlaceList
                places={places}
                currentLocation={currentLocation}
                calculateDistance={calculateDistance}
                onPlaceClick={handlePlaceClick}
                onAdditionalTourClick={handleAdditionalTourClick} //
              />
            </div>
            <div className="random-tours-section">
              <Random count={3} />
            </div>
          </div>
        ) : (
          <p>No tour details available for the selected tour</p>
        )}
      </div>
    </BasicLayout>
  );
};

export default TourReadPage;
