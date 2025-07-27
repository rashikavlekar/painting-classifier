export const fetchHistory = async (user_email) => {
  const response = await fetch(`http://localhost:8000/history/?user_email=${user_email}`);
  if (!response.ok) throw new Error("Failed to fetch history");
  return await response.json();
};

export const fetchGallery = async (user_email) => {
  const response = await fetch(`http://localhost:8000/gallery/?user_email=${user_email}`);
  if (!response.ok) throw new Error("Failed to fetch gallery");
  return await response.json();
};
