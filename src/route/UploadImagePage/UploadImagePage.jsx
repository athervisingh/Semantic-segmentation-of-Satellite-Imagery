import React, { useState, useRef, useEffect } from "react";
import { Download, ImagePlus, MinusCircle, MousePointer2, PlusCircle } from "lucide-react";

const UploadImagePage = () => {
  const canvasRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);
  const [points, setPoints] = useState([]);
  const [value, setValue] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [threshold, setThreshold] = useState(1);

  useEffect(() => {
    const storedImage = localStorage.getItem("uploadedImage");
    if (storedImage) {
      setUploadedImage(storedImage); // Load image from local storage
    }
  }, []);

  useEffect(() => {
    if (uploadedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Set canvas dimensions to match image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
      };

      img.src = uploadedImage;
    }
  }, [uploadedImage]);

  useEffect(() => {
    console.log(finalData);
  }, [finalData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result;
        setUploadedImage(base64Image); // Set the uploaded image in state
        localStorage.setItem("uploadedImage", base64Image); // Store the image in local storage
        console.log("Image stored in local storage:", base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDataSend = () => {
    console.log("ImageButton clicked!");
    // sendDataToSam();
  };

  const handleCanvasClick = (e) => {
    if (value === null) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);

      setPoints((prevPoints) => [...prevPoints, { x, y }]);
      setFinalData((prev) => [...prev, { coordinates: { x, y }, label: value }]);

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = value === 1 ? "greenyellow" : "red";
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImageDimensions(null);
    setPoints([]);
    setFinalData([]);
    setValue(null);
    localStorage.removeItem("uploadedImage"); // Remove the image from local storage
  };

  const handleThresholdChange = (num) => {
    setThreshold(num);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 flex items-center justify-center relative">
        {uploadedImage ? (
          <canvas
            ref={canvasRef}
            className="shadow-2xl cursor-crosshair"
            onClick={handleCanvasClick}
          ></canvas>
        ) : (
          <div
            className="text-center border-2 border-dashed border-gray-400 p-12 rounded-xl
            hover:border-blue-500 transition-all duration-300 group cursor-pointer"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <div className="mb-6">
              <ImagePlus
                size={64}
                className="mx-auto text-gray-400 group-hover:text-blue-500
                transition-colors duration-300"
              />
            </div>
            <p className="text-gray-600 mb-4 text-lg group-hover:text-blue-600 transition-colors duration-300">
              Drag and drop an image here
            </p>
            <p className="text-gray-500 mb-6">or</p>
            <div
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md
              hover:bg-blue-600 active:bg-blue-700 transition-all duration-300
              group-hover:shadow-lg"
            >
              Upload Image
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}
      </div>
      <div className="w-16 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col items-center py-6 shadow-lg">
        <button
          className={`mb-4 p-2 rounded-md ${value === 1 ? "bg-blue-700" : ""}`}
          onClick={() => setValue(1)}
        >
          <PlusCircle size={24} />
        </button>
        <button
          className={`mb-4 p-2 rounded-md ${value === 0 ? "bg-blue-700" : ""}`}
          onClick={() => setValue(0)}
        >
          <MinusCircle size={24} />
        </button>
        {uploadedImage && (
          <button
            onClick={handleRemoveImage}
            className="mb-4 p-2 rounded-md hover:bg-red-600 transition-all duration-200"
          >
            <ImagePlus size={24} className="transform rotate-45" />
          </button>
        )}
        <button
          onClick={handleDataSend}
          className="mb-4 p-2 rounded-md hover:bg-yellow-500 transition-all duration-200"
        >
          <MousePointer2 size={24} className="transform -rotate-6" />
        </button>
      </div>
      <div className="relative bg-bg-color rounded-lg">
        <div className="absolute w-40 h-10 bottom-24 right-20 ">
          <h2>Threshold Slider</h2>
          <input
            type="range"
            min={1}
            max={5}
            value={threshold}
            onChange={(e) => handleThresholdChange(Number(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-blue-600 to-blue-600  rounded-full appearance-none cursor-pointer focus:outline-none"
          />
          <div>Current Value : {threshold}</div>
        </div>
      </div>
    </div>
  );
};

export default UploadImagePage;
