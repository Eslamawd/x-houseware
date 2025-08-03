import { useEffect, useState } from "react";

const ImageSlider = ({ images }) => {
  const parsedImages = Array.isArray(images)
    ? images
    : JSON.parse(images || "[]");

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === parsedImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [parsedImages]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === parsedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? parsedImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {/* الصور */}

      <img
        src={`${parsedImages[currentIndex]}`}
        alt={`slide-${currentIndex}`}
        className=" object-cover  w-full h-full transition duration-700 ease-in-out"
      />

      {/* أزرار التنقل */}
      <button
        onClick={goToPrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
      >
        ❮
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
      >
        ❯
      </button>

      {/* المؤشرات (دوائر) */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {parsedImages.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              currentIndex === index ? "bg-green-300" : "bg-green-800"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
