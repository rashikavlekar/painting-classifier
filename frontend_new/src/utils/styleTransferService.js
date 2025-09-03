export const convertImageStyle = async (imageFile, styleUrl) => {
  const apiKey = import.meta.env.VITE_PICSART_API_KEY;
  if (!apiKey) {
    throw new Error("API key not configured. Please add your key.");
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  // Instead of fetching the style image in browser, pass the URL
  // Make sure it's the *raw* image URL from GitHub
  formData.append('reference_image_url', styleUrl);

  try {
    const response = await fetch('https://api.picsart.io/tools/1.0/styletransfer', { 
      method: 'POST',
      headers: { 'X-Picsart-API-Key': apiKey },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || 'API request failed');
    }

    const data = await response.json();
    if (data?.data?.url) {
      return data.data.url;
    } else {
      throw new Error('Could not find image URL in API response.');
    }
  } catch (error) {
    console.error("Style Transfer Service Error:", error);
    throw error;
  }
};
