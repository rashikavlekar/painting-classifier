import React, { useRef, useState } from 'react';
import { Upload, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../components/ActionButton';

const UploadPage = ({ setHistory }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const classifyImage = () => {
    if (!uploadedImage) return;

    //  Simulated classification result
    const result = {
      id: Date.now(),
      style: 'Impressionism',
      confidence: 0.87,
      description: 'This painting exhibits visible brush strokes and a soft color palette typical of Impressionism.'
    };

    const classification = {
      ...result,
      image: uploadedImage,
    };

    //  Add to history
    setHistory(prev => [...prev, classification]);

    // Pass result and image to ResultsPage
    navigate('/results', {
      state: {
        result,
        image: uploadedImage,
      }
    });
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
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <ActionButton onClick={classifyImage} icon={<BrainCircuit />} text="Classify" primary />
            <ActionButton onClick={triggerFileUpload} icon={<Upload />} text="Change Image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
