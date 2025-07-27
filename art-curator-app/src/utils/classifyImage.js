export const classifyImage = async (file, user_email) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_email", user_email);

  const response = await fetch("http://localhost:8000/predict/", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Prediction failed");
  }

  return await response.json();
};
