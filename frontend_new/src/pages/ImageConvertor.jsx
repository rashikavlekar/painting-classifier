// src/pages/ImageConverter.jsx 
import React, { useState, useRef } from 'react'; 
import { Upload, Camera, Loader2, X, Download, Wand2 } from 
'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import ActionButton from '../components/ActionButton'; 
import Aurora from '../components/Aurora'; 
import { supabase } from '../lib/supabase'; 
import { convertImageStyle } from '../utils/styleTransferService'; 
// ✅ Using the separated API service 
// --- Constants --- 
const STYLES = [
    { name: 'Starry Night', url: "https://raw.githubusercontent.com/Giz17/styles/main/OIP.webp"},
    { name: 'Caricature', url: "https://raw.githubusercontent.com/Giz17/styles/main/OIP%20%281%29.webp"},
    { name: 'Starry Night', url: "https://raw.githubusercontent.com/Giz17/styles/main/1fa8c579717a657c197138cb54f4e882.jpg"},
    { name: 'Starry Night', url: "https://raw.githubusercontent.com/Giz17/styles/main/19595.jpg.jpeg"},
    { name: 'watercolor', url: "https://raw.githubusercontent.com/Giz17/styles/main/008_e17fbb88.jpg"},
     
   
];

const ImageConverter = () => { 
    // State Management 
    const [uploadedImage, setUploadedImage] = useState(null); 
    const [imageFile, setImageFile] = useState(null); 
    const [isCameraOpen, setIsCameraOpen] = useState(false); 
    const [stream, setStream] = useState(null); 
    const [showStyles, setShowStyles] = useState(false); 
    const [isLoading, setIsLoading] = useState(false); 
    const [resultImageUrl, setResultImageUrl] = useState(''); 
    const [error, setError] = useState(''); 
    // Refs 
    const fileInputRef = useRef(null); 
    const videoRef = useRef(null); 
    const canvasRef = useRef(null); 
    const navigate = useNavigate(); 
    // --- File & Camera Logic --- 
    const triggerFileUpload = () => fileInputRef.current.click(); 
    const handleImageSelection = (file, imageUrl) => { 
        if (file && imageUrl) { 
            setUploadedImage(imageUrl); 
            setImageFile(file); 
            setShowStyles(false); 
            setResultImageUrl(''); 
            setError(''); 
        } 
    }; 
    const handleFileChange = (event) => { 
        const file = event.target.files[0]; 
        if (file) { 
            const reader = new FileReader(); 
            reader.onload = () => handleImageSelection(file, 
reader.result); 
            reader.readAsDataURL(file); 
        } 
    }; 
    const openCamera = async () => { 
        try { 
            const mediaStream = await 
navigator.mediaDevices.getUserMedia({ video: { facingMode: 
'environment' } }); 
            setStream(mediaStream); 
            setIsCameraOpen(true); 
            if (videoRef.current) videoRef.current.srcObject = 
mediaStream; 
        } catch (error) { 
            console.error('Error accessing camera:', error); 
            alert('Could not access the camera. Please check permissions.'); 
        } 
    }; 
    const closeCamera = () => { 
        if (stream) stream.getTracks().forEach((track) => 
track.stop()); 
        setIsCameraOpen(false); 
        setStream(null); 
    }; 
    const handleCapture = () => { 
        if (videoRef.current && canvasRef.current) { 
            const video = videoRef.current; 
            const canvas = canvasRef.current; 
            canvas.width = video.videoWidth; 
            canvas.height = video.videoHeight; 
            const ctx = canvas.getContext('2d'); 
            ctx.drawImage(video, 0, 0, canvas.width, 
canvas.height); 
            canvas.toBlob((blob) => { 
                const file = new File([blob], 'captured.jpg', 
{ type: 'image/jpeg' }); 
                handleImageSelection(file, 
URL.createObjectURL(blob)); 
            }, 'image/jpeg'); 
            closeCamera(); 
        } 
    }; 
    const resetState = () => { 
        setUploadedImage(null); 
        setImageFile(null); 
        setShowStyles(false); 
        setResultImageUrl(''); 
    }; 
    // --- API & Download Logic --- 
    const handleStyleSelect = async (styleUrl) => { 
        if (!imageFile) return; 
        setIsLoading(true); 
        setError(''); 
        setResultImageUrl(''); 
        try { 
            const { data: { user } } = await 
supabase.auth.getUser(); 
            if (!user) { 
                alert("Please log in to generate images."); 
                navigate('/auth'); 
                return; 
            } 
             
            // ✅ Calling the abstracted API service function 
            const newImageUrl = await convertImageStyle(imageFile, 
styleUrl); 
            setResultImageUrl(newImageUrl); 
        } catch (err) { 
            setError(err.message); 
        } finally { 
            setIsLoading(false); 
        } 
    }; 
    const handleDownload = async () => { 
        if (!resultImageUrl) return; 
        try { 
            const response = await fetch(resultImageUrl); 
            const blob = await response.blob(); 
            const url = window.URL.createObjectURL(blob); 
            const link = document.createElement('a'); 
            link.href = url; 
            link.download = 'stylized-image.jpg'; 
            document.body.appendChild(link); 
            link.click(); 
            document.body.removeChild(link); 
            window.URL.revokeObjectURL(url); 
        } catch (err) { 
            console.error("Download failed:", err); 
            setError("Could not download the image."); 
        } 
    }; 
    return ( 
        <div className="relative w-full min-h-screen bg-white 
dark:bg-gray-900 overflow-hidden"> 
            {/* Aurora Background */} 
            <div className="absolute inset-0 z-0 pointer-events
none"> 
                <Aurora className="absolute top-0 left-0 w-1/2 h
full" colorStops={['#3A29FF', '#FF94B4', '#FF3232']} /> 
                <Aurora className="absolute top-0 right-0 w-1/2 h
full" colorStops={['#FF3232', '#FF94B4', '#3A29FF']} /> 
            </div> 
            <input type="file" accept="image/*" 
onChange={handleFileChange} ref={fileInputRef} 
className="hidden" /> 
            <canvas ref={canvasRef} className="hidden" /> 
            <div className="relative z-10 px-4 py-6 flex justify
center items-center min-h-screen"> 
                <div className="w-full max-w-4xl bg-white/30 
dark:bg-white/10 backdrop-blur-md border border-white/40 
dark:border-white/20 rounded-3xl p-8 shadow-2xl text-center"> 
                     
                    {/* Initial Upload State */} 
                    {!uploadedImage && ( 
                        <> 
                            <Wand2 className="w-16 h-16 text
gray-500 dark:text-gray-400 mb-6 mx-auto" /> 
                            <h2 className="text-2xl font-semibold 
text-gray-800 dark:text-white mb-2">Generate a New Style</h2> 
                            <p className="text-gray-600 dark:text
gray-300 mb-8">Select an image file or use your camera to begin 
the transformation.</p> 
                            <div className="flex flex-col sm:flex
row gap-4 justify-center mt-4"> 
                                <ActionButton 
onClick={triggerFileUpload} icon={<Upload />} text="Select Image" 
primary /> 
                                <ActionButton onClick={openCamera} 
icon={<Camera />} text="Use Camera" /> 
                            </div> 
                        </> 
                    )} 
                    {/* Image Uploaded State */} 
                    {uploadedImage && ( 
                        <div className="flex flex-col gap-8"> 
                            <div className="grid grid-cols-1 
md:grid-cols-2 gap-8 items-center"> 
                                {/* Image Preview */} 
                                <div> 
                                    <h3 className="text-xl font
semibold text-gray-800 dark:text-white mb-4">Your Image</h3> 
                                    <img src={uploadedImage} 
alt="Uploaded artwork" className="max-h-[400px] w-auto rounded-xl 
shadow-lg object-contain mx-auto" /> 
                                </div> 
                                {/* Actions */} 
                                <div className="flex flex-col 
gap-4"> 
                                    <ActionButton onClick={() => 
setShowStyles(true)} icon={<Wand2 />} text="Convert" primary 
disabled={showStyles} /> 
                                    <ActionButton 
onClick={resetState} icon={<Upload />} text="Choose New Image" /> 
                                </div> 
                            </div> 
                            {/* Style Selector */} 
                            {showStyles && ( 
                                <div className="border-t border
white/20 pt-8"> 
                                    <h3 className="text-xl font
semibold text-gray-800 dark:text-white mb-4">Choose a Style</h3> 
                                    <div className="grid grid
cols-3 sm:grid-cols-6 gap-4"> 
                                        {STYLES.map((style) => ( 
                                            <div key={style.name} 
className="aspect-square rounded-lg overflow-hidden cursor-pointer 
border-2 border-transparent hover:border-blue-500 transition-all" 
onClick={() => handleStyleSelect(style.url)}> 
                                                <img 
src={style.url} alt={style.name} className="w-full h-full object
cover" /> 
                                            </div> 
                                        ))} 
                                    </div> 
                                </div> 
                            )} 
                            {/* Result Section */} 
                            {(isLoading || resultImageUrl || 
error) && ( 
                                <div className="border-t border
white/20 pt-8"> 
                                    <h3 className="text-xl font
semibold text-gray-800 dark:text-white mb-4">Result</h3> 
                                    <div className="w-full min-h
[300px] flex items-center justify-center bg-black/20 rounded-xl"> 
                                        {isLoading && <Loader2 
className="w-12 h-12 animate-spin text-white" />} 
                                        {error && <p 
className="text-red-400 font-medium px-4">{error}</p>} 
                                        {resultImageUrl && <img 
src={resultImageUrl} alt="Stylized result" className="max-h
[400px] w-auto rounded-xl shadow-lg object-contain" />} 
                                    </div> 
                                    {resultImageUrl && !isLoading 
&& ( 
                                        <div className="mt-6"> 
                                            <ActionButton 
onClick={handleDownload} icon={<Download />} text="Download Image" 
primary /> 
                                        </div> 
                                    )} 
                                </div> 
                            )} 
                        </div> 
                    )} 
                </div> 
            </div> 
            {/* Camera Modal */} 
            {isCameraOpen && ( 
                <div className="fixed inset-0 z-50 flex flex-col 
items-center justify-center bg-black/80 backdrop-blur-sm"> 
                    <video ref={videoRef} autoPlay playsInline 
className="w-full max-w-4xl h-auto rounded-lg shadow-2xl" /> 
                    <div className="flex items-center gap-6 mt-6"> 
                        <ActionButton onClick={handleCapture} 
icon={<Camera />} text="Capture" primary /> 
                        <button onClick={closeCamera} 
className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white 
transition-colors" aria-label="Close camera"> 
                            <X size={24} /> 
                        </button> 
                    </div> 
                </div> 
            )} 
        </div> 
    ); 
}; 
export default ImageConverter; 