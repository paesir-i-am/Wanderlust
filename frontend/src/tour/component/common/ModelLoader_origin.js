import React, { useEffect, useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";

const ModelLoader = () => {
  const [model, setModel] = useState(null);
  const [labels, setLabels] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

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
        const warmupResult = tf.tidy(() => {
          const warmupInput = tf.zeros([1, 224, 224, 3]);
          const prediction = loadedModel.predict(warmupInput);
          return prediction.dataSync();
        });
        console.log("Warmup prediction:", warmupResult);

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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">도시 이미지 분류기</h2>

      <div className="max-w-md mx-auto">
        {loading ? (
          <p>모델을 로딩중입니다...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="mb-4"
            />

            {imageUrl && (
              <div className="mb-4">
                <img
                  src={imageUrl}
                  alt="Selected"
                  className="max-w-full h-auto rounded"
                />
              </div>
            )}

            {prediction && (
              <div className="p-4 bg-gray-100 rounded">
                <h3 className="font-bold mb-2">예측 결과:</h3>
                <p>도시: {prediction.label}</p>
                <p>확률: {prediction.probability}%</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelLoader;
