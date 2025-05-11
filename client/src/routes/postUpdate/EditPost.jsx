import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import apiRequest from "../../components/lib/apiRequest";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState({});
  const [postDetail, setPostDetail] = useState({});

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await apiRequest.get(`/posts/${postId}`);
        setPostData(response.data); // Assuming response contains the post data
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };
    fetchPostData();
  }, [postId]);

  const handleImageChange = (index, value) => {
    const newImages = [...(postData.images || [])];
    newImages[index] = value;
    setPostData({ ...postData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiRequest.put(`/posts/${postData.id}`, {
        postData,
        postDetail,
      });

      if (response.status === 200) {
        navigate(`/post/${postData.id}`); // Redirect to post detail page after successful update
      }
    } catch (err) {
      console.log(err);
      alert("Failed to update post.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={postData.title || ""}
        onChange={(e) => setPostData({ ...postData, title: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={postData.price || ""}
        onChange={(e) =>
          setPostData({ ...postData, price: parseInt(e.target.value) })
        }
      />
      <input
        type="text"
        placeholder="City"
        value={postData.city || ""}
        onChange={(e) => setPostData({ ...postData, city: e.target.value })}
      />

      {/* Image URLs */}
      {(postData.images || []).map((img, i) => (
        <input
          key={i}
          type="text"
          placeholder={`Image ${i + 1}`}
          value={img}
          onChange={(e) => handleImageChange(i, e.target.value)}
        />
      ))}
      <button
        type="button"
        onClick={() =>
          setPostData({ ...postData, images: [...(postData.images || []), ""] })
        }
      >
        Add Image
      </button>

      <textarea
        placeholder="Description"
        value={postDetail.desc || ""}
        onChange={(e) => setPostDetail({ ...postDetail, desc: e.target.value })}
      />

      <input
        type="number"
        placeholder="Size (m²)"
        value={postDetail.size || ""}
        onChange={(e) =>
          setPostDetail({ ...postDetail, size: parseInt(e.target.value) })
        }
      />

      <button type="submit">Update Post</button>
    </form>
  );
}
