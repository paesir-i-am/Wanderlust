import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../scss/AirportApi.scss';
import BasicLayout from '../../../common/layout/basicLayout/BasicLayout';

const terminalMapping = {
  "10000140": "제1 여객터미널 - 단기주차장 1",
  "10000160": "제1 여객터미널 - 단기주차장 2",
  "10000280": "제1 여객터미널 - 장기주차장 1",
  "10000040": "제1 여객터미널 - 장기주차장 3",
  "10000020": "제1 여객터미널 - 장기주차장 4",
  "10000170": "제2 여객터미널 - 장기주차장 1",
  "10000030": "제2 여객터미널 - 장기주차장 2",
  "10000190": "제2 여객터미널 - 단기주차장 2",
  "10000270": "제2 여객터미널 - 단기주차장 3"
};

// 날짜 포맷 함수 (YYYY-MM-DD, hh:mm:ss 형식으로 변환)
const formatDate = (dateString) => {
  // 입력 형식: YYYYMMDDhhmmss (예: 20241231121528)
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  const hours = dateString.substring(8, 10);
  const minutes = dateString.substring(10, 12);
  const seconds = dateString.substring(12, 14);

  // Date 객체 생성
  const formattedDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);

  if (isNaN(formattedDate)) {
    return "정보 없음"; // 날짜 형식이 잘못된 경우
  }

  // 날짜와 시간을 분리하여 출력
  const datePart = `${year}-${month}-${day}`;
  
  // 24시간 형식으로 시간 출력
  const timePart = `${formattedDate.getHours().toString().padStart(2, '0')}:${formattedDate.getMinutes().toString().padStart(2, '0')}:${formattedDate.getSeconds().toString().padStart(2, '0')}`;

  return `${datePart}, ${timePart}`;
};

const ShuttleBus = () => {
  const [routeData, setRouteData] = useState({ terminal1: [], terminal2: [] });

  const fetchData = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const url = `http://apis.data.go.kr/B551177/ShtbusInfo/getShtbArrivalPredInfo?serviceKey=${apiKey}&type=json`;
  
      const response = await axios.get(url);
      
      // 응답 데이터 확인
      if (response.data && response.data.response && response.data.response.body && response.data.response.body.items) {
        const data = response.data.response.body.items;
  
        const terminal1Data = [];
        const terminal2Data = [];
  
        data.forEach((item) => {
          const terminalInfo = terminalMapping[item.stopId] || '정보 없음';
          const predictedTime = item.predTimes !== "0" ? item.predTimes : "정보 없음";  // 예측 시간이 0이면 '정보 없음' 처리
          const offerTime = item.ofrTime ? formatDate(item.ofrTime) : "정보 없음";  // 제공 시간 포맷 처리
  
          // 예상 도착 시간(predTimes)이나 실시간 제공 시간(ofrTime)이 정보 없음이 아닌 항목만 추가
          if (predictedTime !== "정보 없음" || offerTime !== "정보 없음") {
            const mappedItem = {
              stopId: item.stopId,
              terminalInfo,
              predictedTime: predictedTime,
              offerTime: offerTime, // 실시간 제공 시간 추가
            };
  
            if (terminalInfo.includes("제1 여객터미널")) {
              terminal1Data.push(mappedItem);
            } else if (terminalInfo.includes("제2 여객터미널")) {
              terminal2Data.push(mappedItem);
            }
          }
        });
  
        setRouteData({ terminal1: terminal1Data, terminal2: terminal2Data });
      } else {
        console.error("API 응답 데이터가 예상과 다릅니다.");
      }
    } catch (err) {
      console.error("데이터 불러오기 실패:", err);
    }
  };

  // 30초마다 API 호출하여 데이터 갱신
  useEffect(() => {
    fetchData();  // 첫 데이터 호출

    const intervalId = setInterval(fetchData, 30000);  // 30초마다 호출

    return () => clearInterval(intervalId);  // 컴포넌트 언마운트 시 주기적인 호출 종료
  }, []);

  return (
    <BasicLayout>
    <div className="airport-bus">
      <h2>공항 셔틀버스 시간표</h2>
      <div className="bus">
        <h3>제1 여객터미널</h3>
        <table>
          <thead>
            <tr>
              <th>정류장</th>
              <th>예상 도착 시간</th>
              <th>실시간 제공 시간</th>
            </tr>
          </thead>
          <tbody>
            {routeData.terminal1.map((route) => (
              <tr key={route.stopId}>
                <td>{route.terminalInfo}</td>
                <td>
                  {route.predictedTime !== "정보 없음" 
                    ? `${route.predictedTime}분`  // "분" 추가
                    : "정보 없음"}
                </td>
                <td>{route.offerTime !== "정보 없음" ? route.offerTime : "정보 없음"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bus">
        <h3>제2 여객터미널</h3>
        <table>
          <thead>
            <tr>
              <th>정류장</th>
              <th>예상 도착 시간</th>
              <th>실시간 제공 시간</th>
            </tr>
          </thead>
          <tbody>
            {routeData.terminal2.map((route) => (
              <tr key={route.stopId}>
                <td>{route.terminalInfo}</td>
                <td>
                  {route.predictedTime !== "정보 없음" 
                    ? `${route.predictedTime}분`  // "분" 추가
                    : "정보 없음"}
                </td>
                <td>{route.offerTime !== "정보 없음" ? route.offerTime : "정보 없음"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </BasicLayout>
  );
};

export default ShuttleBus;
