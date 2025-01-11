import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../scss/AirportApi.scss";
import BasicLayout from "../../../common/layout/basicLayout/BasicLayout";
import BasicLayoutWithoutFlight from "../../../common/layout/basicLayout/BasicLayoutWithoutFlight";

const ShuttleBus = () => {
  const [routeData, setRouteData] = useState({ terminal1: [], terminal2: [] });
  const { search } = useLocation();

  const terminal1Ref = useRef(null);
  const terminal2Ref = useRef(null);

  const terminalMapping = {
    10000140: "제1 여객터미널 - 단기주차장 1",
    10000160: "제1 여객터미널 - 단기주차장 2",
    10000280: "제1 여객터미널 - 장기주차장 1",
    10000040: "제1 여객터미널 - 장기주차장 3",
    10000020: "제1 여객터미널 - 장기주차장 4",
    10000170: "제2 여객터미널 - 장기주차장 1",
    10000030: "제2 여객터미널 - 장기주차장 2",
    10000190: "제2 여객터미널 - 단기주차장 2",
    10000270: "제2 여객터미널 - 단기주차장 3",
  };

  const formatDate = (dateString) => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hours = dateString.substring(8, 10);
    const minutes = dateString.substring(10, 12);
    const seconds = dateString.substring(12, 14);

    const formattedDate = new Date(
      `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`,
    );
    if (isNaN(formattedDate)) {
      return "정보 없음";
    }

    const datePart = `${year}-${month}-${day}`;
    const timePart = `${formattedDate.getHours().toString().padStart(2, "0")}:${formattedDate.getMinutes().toString().padStart(2, "0")}:${formattedDate.getSeconds().toString().padStart(2, "0")}`;
    return `${datePart}, ${timePart}`;
  };

  const fetchData = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const url = `http://apis.data.go.kr/B551177/ShtbusInfo/getShtbArrivalPredInfo?serviceKey=${apiKey}&type=json`;

      const response = await axios.get(url);
      if (response.data?.response?.body?.items) {
        const data = response.data.response.body.items;

        const terminal1Data = [];
        const terminal2Data = [];

        data.forEach((item) => {
          const terminalInfo = terminalMapping[item.stopId] || "정보 없음";
          const predictedTime =
            item.predTimes !== "0" ? item.predTimes : "정보 없음";
          const offerTime = item.ofrTime
            ? formatDate(item.ofrTime)
            : "정보 없음";

          const mappedItem = {
            stopId: item.stopId,
            terminalInfo,
            predictedTime,
            offerTime,
          };

          if (terminalInfo.includes("제1 여객터미널")) {
            terminal1Data.push(mappedItem);
          } else if (terminalInfo.includes("제2 여객터미널")) {
            terminal2Data.push(mappedItem);
          }
        });

        setRouteData({ terminal1: terminal1Data, terminal2: terminal2Data });
      }
    } catch (err) {
      console.error("데이터 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    const selectedTerminal = queryParams.get("terminal") || "T1";

    if (selectedTerminal === "T1" && terminal1Ref.current) {
      terminal1Ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (selectedTerminal === "T2" && terminal2Ref.current) {
      // 강제로 스크롤을 맨 아래로 이동
      setTimeout(() => {
        terminal2Ref.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100); // 약간의 딜레이를 추가
    }
  }, [search]);

  return (
    <BasicLayoutWithoutFlight>
      <div className="airport-bus">
        <h2>공항 셔틀버스 시간표</h2>
        <div ref={terminal1Ref} className="bus scrollable">
          <h3>제1 여객터미널(T1)</h3>
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
                      ? `${route.predictedTime}분`
                      : "정보 없음"}
                  </td>
                  <td>
                    {route.offerTime !== "정보 없음"
                      ? route.offerTime
                      : "정보 없음"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div ref={terminal2Ref} className="bus scrollable">
          <h3>제2 여객터미널(T2)</h3>
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
                      ? `${route.predictedTime}분`
                      : "정보 없음"}
                  </td>
                  <td>
                    {route.offerTime !== "정보 없음"
                      ? route.offerTime
                      : "정보 없음"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BasicLayoutWithoutFlight>
  );
};

export default ShuttleBus;
