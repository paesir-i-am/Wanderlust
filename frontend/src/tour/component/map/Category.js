import React from "react";
import "../scss/map/Category.scss";

const categories = [
  { label: "호텔", type: "lodging" },
  { label: "관광지", type: "tourist_attraction" },
  { label: "음식점", type: "restaurant" },
  { label: "쇼핑몰", type: "shopping_mall" },
  { label: "지하철역", type: "subway_station" },
];

const Category = ({ onCategoryClick }) => {
  return (
    <div className="category-container">
      {categories.map((category) => (
        <button
          key={category.type}
          onClick={() => onCategoryClick(category.type)} // 클릭 시 부모 컴포넌트의 함수 호출
          className="category-button"
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default Category;
