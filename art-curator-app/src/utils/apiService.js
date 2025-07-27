export const fetchHistory = async (user_email) => {
  const res = await fetch(`http://localhost:8000/history/?user_email=${user_email}`);
  if (!res.ok) throw new Error("Failed to load history");
  return await res.json();
};

export const fetchGallery = async (user_email) => {
  const res = await fetch(`http://localhost:8000/gallery/?user_email=${user_email}`);
  if (!res.ok) throw new Error("Failed to load gallery");
  return await res.json();
};
