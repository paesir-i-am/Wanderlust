import React, { useEffect, useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import "./ImageSearch.scss";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../common/api/mainApi";

const ModelLoader = ({ onClose }) => {
  const [model, setModel] = useState(null);
  const [labels, setLabels] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const navigate = useNavigate();

  // 모델과 레이블 로드
  useEffect(() => {
    async function loadModelAndLabels() {
      try {
        console.log("Starting model load...");

        // TensorFlow.js 백엔드 초기화 확인
        await tf.ready();
        console.log("TensorFlow.js backend:", tf.getBackend());

        // 모델 로드
        const loadedModel = await tf.loadLayersModel("/model/model.json");
        console.log("Model loaded successfully");

        // 모델 웜업
        tf.tidy(() => {
          const warmupInput = tf.zeros([1, 224, 224, 3]);
          loadedModel.predict(warmupInput);
        });

        // 레이블 파일 로드
        const labelsResponse = await fetch("/model/index_to_label.json");
        const labelsData = await labelsResponse.json();

        setModel(loadedModel);
        setLabels(labelsData);
        setLoading(false);
      } catch (err) {
        console.error("Error during model/labels loading:", err);
        setError(err.message);
        setLoading(false);
      }
    }

    loadModelAndLabels();
  }, []);

  // 이미지 전처리 함수
  const preprocessImage = useCallback(async (imageElement) => {
    try {
      return tf.tidy(() => {
        // 이미지를 텐서로 변환
        let tensor = tf.browser
          .fromPixels(imageElement)
          // 크기 조정
          .resizeNearestNeighbor([224, 224])
          // float32로 변환
          .toFloat();

        // 정규화 [0, 1]
        tensor = tensor.div(tf.scalar(255));

        // 배치 차원 추가
        return tensor.expandDims(0);
      });
    } catch (err) {
      throw new Error("Image preprocessing failed: " + err.message);
    }
  }, []);

  // 예측 함수
  const predict = useCallback(
    async (tensor) => {
      if (!model || !labels) return null;

      try {
        const prediction = await model.predict(tensor);
        const values = await prediction.data();
        prediction.dispose(); // 메모리 정리

        // 가장 높은 확률의 클래스 찾기
        const maxProbability = Math.max(...values);
        const classIndex = values.indexOf(maxProbability);

        return {
          label: labels[classIndex],
          probability: (maxProbability * 100).toFixed(2),
        };
      } catch (err) {
        throw new Error("Prediction failed: " + err.message);
      }
    },
    [model, labels],
  );

  // 이미지 처리 핸들러
  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // 이미지 파일 로드
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          try {
            setImageUrl(e.target.result);
            const tensor = await preprocessImage(img);
            const result = await predict(tensor);
            setPrediction(result);
            tensor.dispose(); // 메모리 정리
          } catch (err) {
            setError(err.message);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("파일 처리 중 오류가 발생했습니다: " + err.message);
    }
  };

  const handleCityClick = async (cityName) => {
    try {
      const response = await axiosInstance.get(`tour/read/by-city/${cityName}`);

      const tourId = response.data; // 백엔드에서 반환한 tourId
      if (tourId) {
        navigate(`/tour/read/${tourId}`); // tourId로 리다이렉트
      } else {
        alert("해당 도시의 여행지를 찾을 수 없습니다.");
      }
      onClose();
    } catch (error) {
      console.error("Error navigating to city detail:", error);
      alert("도시를 불러오는 데 실패했습니다.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="search-container">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <h2>여행지 이미지 검색</h2>
        {loading ? (
          <p>모델을 로딩중입니다...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div className="search-content">
            {!imageUrl ? (
              <>
                <label className="upload-area" htmlFor="image-upload">
                  <img src="https://via.placeholder.com/40" alt="Upload Icon" />
                  <span>파일을 업로드 해주세요.</span>
                </label>
                <input
                  type="file"
                  id="image-upload"
                  className="upload-input"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </>
            ) : (
              <div className="result-container">
                <div className="image-preview">
                  <img
                    src={imageUrl}
                    alt="Selected"
                    className="preview-image"
                  />
                </div>
                {prediction && (
                  <div className="prediction-result">
                    <h3>예측 결과</h3>
                    <p>
                      도시:
                      <button
                        onClick={() => handleCityClick(prediction.label)}
                        className="city-link"
                        style={{
                          color: "white",
                          fontSize: "1.5rem",
                          marginLeft: "1rem",
                          background: "none",
                        }}
                      >
                        {prediction.label}
                      </button>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelLoader;
