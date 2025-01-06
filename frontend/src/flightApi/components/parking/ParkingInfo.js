import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../scss/AirportApi.scss'; // SCSS 스타일 파일
import BasicLayout from '../../../common/layout/basicLayout/BasicLayout';

const ParkingInfo = () => {
    const [parkingData, setParkingData] = useState([]); // 주차 데이터 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [selectedTerminal, setSelectedTerminal] = useState('T1'); // 선택된 터미널
    const [selectedParkingType, setSelectedParkingType] = useState('short'); // 선택된 주차 유형
    const [filteredParkingData, setFilteredParkingData] = useState([]); // 필터링된 주차 데이터

    const API_KEY = process.env.REACT_APP_API_KEY;
    const ENDPOINT = 'http://apis.data.go.kr/B551177/StatusOfParking/getTrackingParking';

    // API 호출 함수 (페이지 번호를 인자로 받아서 데이터를 가져옴)
    const fetchParkingData = async (pageNo) => {
        try {
            const response = await axios.get(ENDPOINT, {
                params: {
                    serviceKey: decodeURIComponent(API_KEY), // URL 디코딩된 API 키
                    numOfRows: 10, // 한 번에 가져올 데이터 수
                    pageNo, // 페이지 번호 (1 또는 2)
                    type: 'json', // 응답 형식 (JSON)
                    terminal: selectedTerminal, // 선택된 터미널 (T1, T2)
                    parkingType: selectedParkingType, // 선택된 주차장 유형 (short, long)
                },
            });

            console.log('API Response Page:', pageNo, response.data); // 응답 데이터 확인

            const items = response.data?.response?.body?.items || []; // 데이터가 존재하면 사용, 없으면 빈 배열
            return items; // 가져온 데이터 반환
        } catch (err) {
            console.error('API Error:', err);
            setError('데이터를 불러오는 중 오류가 발생했습니다.');
        }
    };

    // 데이터 요청과 필터링을 동시에 처리
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);

            try {
                // 페이지 1과 페이지 2의 데이터를 가져옴
                const dataPage1 = await fetchParkingData(1);
                const dataPage2 = await fetchParkingData(2);

                // 두 페이지의 데이터를 합침
                const combinedData = [...dataPage1, ...dataPage2];

                setParkingData(combinedData); // 상태에 데이터를 설정
            } catch (err) {
                console.error('Error fetching parking data:', err);
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData(); // 데이터 요청 실행
    }, [selectedTerminal, selectedParkingType]); // 터미널이나 주차 유형이 바뀔 때마다 데이터 요청

    // 주차 유형과 터미널에 따라 필터링된 데이터 계산
    useEffect(() => {
        const filterParkingData = () => {
            let filteredData = parkingData;

            // 터미널 필터링 (T1 또는 T2)
            if (selectedTerminal) {
                filteredData = filteredData.filter(item => item.floor && item.floor.includes(selectedTerminal));
            }

            // 주차 유형 (단기, 장기) 필터링
            if (selectedParkingType === 'short') {
                filteredData = filteredData.filter(item => item.floor && item.floor.toLowerCase().includes('단기'));
            } else if (selectedParkingType === 'long') {
                // '장기'가 포함된 항목만 필터링
                filteredData = filteredData.filter(item => item.floor && item.floor.toLowerCase().includes('장기'));
            }

            setFilteredParkingData(filteredData);
        };

        filterParkingData(); // 필터링된 데이터 적용
    }, [parkingData, selectedTerminal, selectedParkingType]);

    // 주차장 혼잡도 색상 (주차율 계산)
    const getStatusColor = (parking, parkingarea) => {
        const occupancyRate = (parseInt(parking) / parseInt(parkingarea)) * 100;
        if (occupancyRate >= 80) return 'danger'; // 혼잡
        if (occupancyRate >= 50) return 'warning'; // 경고
        return 'success'; // 여유
    };

    // 데이터 시간을 보기 좋게 포맷팅
    const formatDate = (datetm) => {
        if (!datetm) return '';
        const year = datetm.substring(0, 4);
        const month = datetm.substring(4, 6);
        const day = datetm.substring(6, 8);
        const hour = datetm.substring(8, 10);
        const minute = datetm.substring(10, 12);
        const second = datetm.substring(12, 14);

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    };

    // 주차 가능 대수 계산 함수
    const calculateAvailableSpaces = (parking, parkingarea) => {
        const availableSpaces = parseInt(parkingarea) - parseInt(parking); // 총 주차면수 - 주차된 수
        return availableSpaces >= 0 ? availableSpaces : 0; // 주차된 수가 총 주차면수보다 많을 경우 0으로 처리
    };

    return (
        <BasicLayout>
        <div className="parking-container">
            {/* 헤더 */}
            <header className="header">
                <h1 className="title">공항 주차장 조회</h1>
            </header>
                {/* 터미널 선택 및 주차장 유형 선택 */}
                <div className="selection-buttons-container">
                    {/* 터미널 선택 */}
                    <div className="terminal-buttons">
                        {['T1', 'T2'].map((terminal) => (
                            <button
                                key={terminal}
                                onClick={() => setSelectedTerminal(terminal)}
                                className={`button ${selectedTerminal === terminal ? 'active' : ''}`}
                            >
                                {terminal === 'T1' ? '제 1 여객터미널' : '제 2 여객터미널'}
                            </button>
                        ))}
                    </div>

                    {/* 주차장 유형 선택 */}
                    <div className="parking-type-buttons">
                        {['short', 'long'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedParkingType(type)}
                                className={`button ${selectedParkingType === type ? 'active' : ''}`}
                            >
                                {type === 'short' ? '단기주차장' : '장기주차장'}
                            </button>
                        ))}
                    </div>
                </div>


            {/* 로딩 */}
            {loading && <div className="loading">데이터를 불러오는 중...</div>}

            {/* 에러 */}
            {error && <div className="error">{error}</div>}

            {/* 주차 데이터 */}
            <div className="parking-levels">
                {filteredParkingData.length === 0 ? (
                    <p>선택한 조건에 맞는 주차장이 없습니다.</p>
                ) : (
                    filteredParkingData.map((item, index) => (
                        <div key={index} className="parking-level">
                            <span className="parking-lot-name">
                                {item.floor || '알 수 없음'} {/* 주차장 층 */}
                            </span>
                            <div className="availability">
                            <div className="occupancy-bar-container">
                                <div
                                className={`occupancy-bar ${getStatusColor(item.parking, item.parkingarea)}`}
                                style={{
                                    width: `${(parseInt(item.parking) / parseInt(item.parkingarea)) * 100}%`,
                                }}
                                ></div>
                                <span className="occupancy-rate">
                                {item.parkingarea
                                    ? `${((parseInt(item.parking) / parseInt(item.parkingarea)) * 100).toFixed(0)}%`
                                    : '0%'}
                                </span>
                            </div>
                            </div>
                            <div className="parking-info">
                            <p><strong>총 주차면적:</strong> {item.parkingarea || '0'}</p>
                            <p><strong>주차된 차량 수:</strong> {item.parking || '0'}</p>
                                <p><strong>남은 주차 공간:</strong> {calculateAvailableSpaces(item.parking, item.parkingarea)}</p>
                                <p><strong>실시간 주차 현황:</strong> {formatDate(item.datetm) || '알 수 없음'}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
        </BasicLayout>
    );
};

export default ParkingInfo;
