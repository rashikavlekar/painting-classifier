import React, { useEffect, useState } from 'react';
import { LoaderCircle, Trash2 } from 'lucide-react';

const user_email =  "guest@example.com";
const HistoryPage = ({ userEmail }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`http://localhost:8000/history/?user_email=${user_email}`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };


const CollapsibleDescription = ({ description }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(prev => !prev);

  return (
    <div className="mt-2">
      <p
        className={`text-gray-600 dark:text-gray-300 text-sm whitespace-pre-line transition-all duration-300 ease-in-out ${
          expanded ? '' : 'line-clamp-3'
        }`}
      >
        {description}
      </p>
      <button
        onClick={toggleExpanded}
        className="mt-1 text-blue-500 hover:underline text-xs font-medium"
      >
        {expanded ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
};




  const handleDelete = async (id) => {
  if (!id) return;

  try {
    const res = await fetch(`http://localhost:8000/delete/?prediction_id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      // Remove from local state
      setHistory(prev => prev.filter(item => item.id !== id));
    } else {
      alert(data.error || "Failed to delete");
    }
  } catch (err) {
    console.error("Delete error:", err);
    alert("Something went wrong");
  }
};

  useEffect(() => {
    fetchHistory();
  }, [userEmail]);

  if (loading) {
    return <div className="text-center p-10"><LoaderCircle className="animate-spin w-6 h-6" /></div>;
  }

  if (history.length === 0) {
    return <p className="text-center mt-10 text-gray-500">No history found for {userEmail}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {history.map((item) => (
        <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg relative">
          <img
            src={item.image_url}
            alt={item.style}
            className="w-full h-48 object-cover rounded"
          />
          <h3 className="text-lg font-bold mt-2 text-blue-600">{item.style}</h3>
          <p className="text-sm text-gray-500">
            Confidence: {(item.confidence * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(item.timestamp).toLocaleString()}
          </p>

          {item.description && (
              <CollapsibleDescription description={item.description} />
          )}


          <button
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
            onClick={() => handleDelete(item.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default HistoryPage;
