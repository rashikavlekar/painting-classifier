import React from 'react';
import { Upload, BrainCircuit } from 'lucide-react';
import ActionButton from '../components/ActionButton';

const UploadPage = ({ triggerFileUpload, uploadedImage, classifyImage }) => (
  <div className="text-center flex flex-col items-center justify-center p-4 animate-fade-in min-h-[calc(100vh-150px)]">
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

export default UploadPage;
