import React, { useRef, useState } from 'react';
import { Upload, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../components/ActionButton';
import { classifyImage } from '../utils/classifyImage'; // ✅ Import here

const UploadPage = ({ setHistory }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [file, setFile] = useState(null);  // ✅ Store original file
  const [loading, setLoading] = useState(false);
  const [classificationMessage, setClassificationMessage] = useState(null); // ✅ Add message
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // ✅ Store original file
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result); // base64 preview
      };
      reader.readAsDataURL(selectedFile);
      setClassificationMessage(null); // Reset any previous message
    }
  };

  const handleClassify = async () => {
    if (!file) return;
    try {
      setLoading(true);
      const result = await classifyImage(file, "guest@example.com");

      const classification = {
        id: Date.now(),
        style: result.predictions[0][0], // top prediction style
        confidence: result.predictions[0][1],
        predictions: result.predictions,
        description: result.description,
        image: uploadedImage,
        timestamp: result.timestamp,
        image_url: result.image_url,
      };

      if (result.message) {
        setClassificationMessage(result.message); // ✅ Store message if exists
      }

      // Update frontend history state
      setHistory(prev => [...prev, classification]);

      // Navigate to results page
      navigate('/results', {
        state: {
          result: classification,
          image: uploadedImage
        }
      });
    } catch (error) {
      alert(error.message || "Something went wrong while classifying.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center flex flex-col items-center justify-center p-4 animate-fade-in min-h-[calc(100vh-150px)]">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      {!uploadedImage ? (
        <>
          <Upload className="w-20 h-20 text-gray-400 dark:text-gray-500 mb-4" />
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Upload Your Artwork</h2>
          <p className="max-w-md mb-8 text-gray-500 dark:text-gray-400">
            Select an image file from your device to begin the classification process.
          </p>
          <ActionButton onClick={triggerFileUpload} icon={<Upload />} text="Select Image" primary />
        </>
      ) : (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold">Image Preview</h3>
          <img src={uploadedImage} alt="Uploaded art" className="max-w-full max-h-80 object-contain rounded-lg shadow-md" />
          {classificationMessage && (
            <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium text-center">
              ⚠️ {classificationMessage}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <ActionButton onClick={handleClassify} icon={<BrainCircuit />} text={loading ? "Classifying..." : "Classify"} primary />
            <ActionButton onClick={triggerFileUpload} icon={<Upload />} text="Change Image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
