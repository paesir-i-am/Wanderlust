from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

# GraphQL API URL 및 헤더 설정
url = "https://airline-api.naver.com/graphql"
headers = {
    "Content-Type": "application/json",
    "Referer": "https://flight.naver.com/",
    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
}

# 요청을 보내는 함수
def make_request(payload):
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=20)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"API 요청 실패: {e}")
        return None

# Payload 설정 함수
def create_payload(departureAirport, arrivalAirport, departureDate, arrivalDate=None, galileo_key="", travel_biz_key="", trip_type="OW", child=0, infant=0, fareType="Y"):
    itinerary = [{"departureAirport": departureAirport, "arrivalAirport": arrivalAirport, "departureDate": departureDate}]
    
    if trip_type == "RT" and arrivalDate:
        itinerary.append({"departureAirport": arrivalAirport, "arrivalAirport": departureAirport, "departureDate": arrivalDate})

    return {
        "operationName": "getInternationalList",
        "variables": {
            "adult": 1,
            "child": child,
            "infant": infant,
            "where": "pc",
            "isDirect": True,
            "galileoFlag": True,
            "travelBizFlag": True,
            "fareType": fareType,
            "itinerary": itinerary,
            "trip": trip_type,
            "galileoKey": galileo_key,
            "travelBizKey": travel_biz_key,
        },
        "query": """
            query getInternationalList($trip: InternationalList_TripType!, $itinerary: [InternationalList_itinerary]!, $adult: Int = 1, $child: Int = 0, $infant: Int = 0, $fareType: InternationalList_CabinClass!, $where: InternationalList_DeviceType = pc, $isDirect: Boolean = false, $galileoKey: String, $galileoFlag: Boolean = true, $travelBizKey: String, $travelBizFlag: Boolean = true) {
                internationalList(
                    input: {
                        trip: $trip,
                        itinerary: $itinerary,
                        person: {adult: $adult, child: $child, infant: $infant},
                        fareType: $fareType,
                        where: $where,
                        isDirect: $isDirect,
                        galileoKey: $galileoKey,
                        galileoFlag: $galileoFlag,
                        travelBizKey: $travelBizKey,
                        travelBizFlag: $travelBizFlag
                    }
                ) {
                    galileoKey
                    travelBizKey
                    results {
                        airlines
                        airports
                        fareTypes
                        schedules
                        fares
                    }
                }
            }
        """
    }

# Spring Boot로 데이터를 전송하는 함수
def send_to_spring_boot(data, endpoint):
    spring_boot_url = f"http://localhost:8080/flight/{endpoint}/upload"
    headers = {"Content-Type": "application/json"}
    response = requests.post(spring_boot_url, json=data, headers=headers)
    if response.status_code == 200:
        print(f"{endpoint} 데이터가 Spring Boot로 전송되었습니다.")
    else:
        print(f"{endpoint} 데이터 전송 실패: {response.status_code}, {response.text}")

@app.route('/api/search', methods=['POST'])
def search_flights():
    data = request.json
    print("수신 데이터:", data)

    departureAirport = data.get("departureAirport")
    arrivalAirport = data.get("arrivalAirport")
    departureDate = data.get("departureDate")
    arrivalDate = data.get("arrivalDate")
    child = data.get("child", 0)
    infant = data.get("infant", 0)
    fareType = data.get("fareType", "Y")  # 기본값 'Y'

    print("서버에서 받은 fareType:", fareType)  # fareType 확인

    # 필수 데이터 확인
    if not all([departureAirport, arrivalAirport, departureDate]):
        return jsonify({"status": "error", "message": "출발지, 도착지, 출발 날짜는 필수입니다."}), 400

    # arrivalDate가 없으면 "oneway"로 처리
    trip_type = "RT" if arrivalDate else "OW"

    max_retries = 5
    galileo_key = ""
    travel_biz_key = ""

    # 첫 번째 요청 - 데이터 가져올 때까지 재시도
    for attempt in range(max_retries):
        payload1 = create_payload(departureAirport, arrivalAirport, departureDate, arrivalDate, galileo_key, travel_biz_key, trip_type, child, infant, fareType)
        response_data1 = make_request(payload1)

        if response_data1 and response_data1.get("data", {}).get("internationalList"):
            galileo_key = response_data1["data"]["internationalList"].get("galileoKey", "")
            travel_biz_key = response_data1["data"]["internationalList"].get("travelBizKey", "")
            print(f"첫 번째 요청 성공: galileoKey={galileo_key}, travelBizKey={travel_biz_key}")
            break
        else:
            print(f"첫 번째 요청 실패 (시도 {attempt + 1}/{max_retries})")
            time.sleep(2)
            if attempt == max_retries - 1:
                return jsonify({"status": "error", "message": "첫 번째 요청에서 데이터를 가져오지 못했습니다."}), 500

    # 두 번째 요청 - 첫 번째 요청에서 받은 galileoKey와 travelBizKey 사용
    for attempt in range(max_retries):
        payload2 = create_payload(departureAirport, arrivalAirport, departureDate, arrivalDate, galileo_key, travel_biz_key, trip_type, child, infant, fareType)
        response_data2 = make_request(payload2)

        if response_data2 and response_data2.get("data", {}).get("internationalList"):
            print("두 번째 요청 성공")
            results = response_data2["data"]["internationalList"]["results"]

            # Spring Boot로 각 데이터를 전송
            send_to_spring_boot(results.get("airlines", []), "airlines")
            send_to_spring_boot(results.get("airports", []), "airports")
            send_to_spring_boot(results.get("fareTypes", []), "fareTypes")
            send_to_spring_boot(results.get("schedules", []), "schedules")
            send_to_spring_boot(results.get("fares", []), "fares")

            return jsonify({"status": "success", "message": "데이터 처리 및 전송 완료", "results": results}), 200
        else:
            print(f"두 번째 요청 실패 (시도 {attempt + 1}/{max_retries})")
            time.sleep(2)
            if attempt == max_retries - 1:
                return jsonify({"status": "error", "message": "두 번째 요청에서 데이터를 가져오지 못했습니다."}), 500

    return jsonify({"status": "error", "message": "두 번째 요청 실패"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
  
