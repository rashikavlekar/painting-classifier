export const classifyImage = async (file, user_email) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_email", user_email); // or email

  const res = await fetch('http://localhost:8000/predict/', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Classification failed');
  return await res.json();
};
