import React, { useCallback, useState, useEffect } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "../scss/map/Map.scss";

const Map = ({
  center,
  places,
  currentLocation,
  distanceValues,
  setActiveMarker,
  travelMode,
  calculateAndShowRoute,
  setMap,
}) => {
  const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 장소 상태
  const [selectedPlaceAddress, setSelectedPlaceAddress] = useState(""); // 선택된 장소의 주소
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false); // 구글 맵 로딩 상태

  // **여기에서 콘솔 로그 추가**: 환경 변수 확인
  useEffect(() => {
    console.log(
      "Google Maps API Key:",
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    );
  }, []);

  // 장소의 주소를 가져오기 위해 Geocoder 사용
  const getPlaceAddress = (place) => {
    if (!window.google || !window.google.maps) return; // 구글 맵이 로드되지 않으면 처리 안 함

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: place.geometry.location },
      (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
          setSelectedPlaceAddress(results[0].formatted_address); // 주소 설정
        } else {
          setSelectedPlaceAddress("주소를 가져오는 데 실패했습니다.");
        }
      },
    );
  };

  // 두 좌표 간 거리 계산 (킬로미터 단위)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    if (!window.google) return 0;
    const point1 = new window.google.maps.LatLng(lat1, lng1);
    const point2 = new window.google.maps.LatLng(lat2, lng2);
    return (
      window.google.maps.geometry.spherical.computeDistanceBetween(
        point1,
        point2,
      ) / 1000 // km로 변환
    );
  };

  // 현재 위치와 선택된 장소 간의 거리 계산
  const getDistance = () => {
    if (currentLocation && selectedPlace) {
      return calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        selectedPlace.geometry.location.lat(), // lat() 메서드 호출
        selectedPlace.geometry.location.lng(), // lng() 메서드 호출
      );
    }
    return 0; // 거리 계산이 안 되는 경우
  };

  // 구글 맵 로드 후 상태 설정
  useEffect(() => {
    if (window.google) {
      setGoogleMapsLoaded(true); // 구글 맵 API가 로드되면 상태 변경
    }
  }, []);

  // 마커 클릭 시 장소 정보 설정
  const handleMarkerClick = (place) => {
    setSelectedPlace(place); // 선택된 장소 설정
    getPlaceAddress(place); // 주소를 가져옴
  };

  return (
    <div className="map-container">
      {/* Google Maps API 로드 */}
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={["places", "geometry"]}
        onLoad={() => setGoogleMapsLoaded(true)} // 로드 완료 시 상태 업데이트
      >
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }} // 지도 크기 설정
          center={center}
          zoom={13}
          onLoad={setMap}
          options={{ mapTypeControl: false, fullscreenControl: false }}
        >
          {/* 현재 위치 마커 */}
          {currentLocation && (
            <Marker
              position={currentLocation}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: "blue",
                fillOpacity: 1,
                strokeColor: "blue",
                strokeWeight: 2,
                scale: 10,
              }}
              title="현재 위치"
              onClick={() =>
                handleMarkerClick({
                  name: "현재 위치",
                  lat: currentLocation.lat,
                  lng: currentLocation.lng,
                  info: `위도: ${currentLocation.lat}, 경도: ${currentLocation.lng}`,
                  geometry: {
                    location: new window.google.maps.LatLng(
                      currentLocation.lat,
                      currentLocation.lng,
                    ),
                  },
                })
              }
            />
          )}

          {/* 장소 마커 */}
          {places.map((place) => {
            if (place.geometry?.location) {
              return (
                <Marker
                  key={place.place_id}
                  position={{
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  }}
                  title={place.name}
                  onClick={() => handleMarkerClick(place)} // 마커 클릭 시 처리
                />
              );
            }
            return null;
          })}

          {/* 선택된 마커에 대한 InfoWindow */}
          {selectedPlace && (
            <InfoWindow
              position={{
                lat: selectedPlace.geometry.location.lat(),
                lng: selectedPlace.geometry.location.lng(),
              }}
              onCloseClick={() => setSelectedPlace(null)} // InfoWindow 닫기
            >
              <div className="info-window-content">
                <h3>{selectedPlace.name}</h3>
                <p>{selectedPlaceAddress}</p>
                {currentLocation && (
                  <p>거리: {getDistance().toFixed(2)} km</p> // 현재 위치와 선택된 장소 간 거리
                )}
                <p>위도: {selectedPlace.geometry.location.lat()}</p>
                <p>경도: {selectedPlace.geometry.location.lng()}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
