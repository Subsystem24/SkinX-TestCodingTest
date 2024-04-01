import Nav from "../Nav/Nav";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import "./Post.css"
import ClipLoader from "react-spinners/ClipLoader";

function Post() {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(null);
  const [post, setPost] = useState(null);
  const { postId } = useParams();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const response = await axios.post(`http://localhost:3333/post/${postId}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        console.log(response.data.post);
        if (response.status === 200) {
          setIsVerified(true);
          setPost(response.data.post);
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        console.error('Verification failed:', error);
        setIsVerified(false);
      }
    };

    verifyAccess();
  }, [postId]);

  useEffect(() => {
    if (isVerified === false) {
      alert("Please Login");
      navigate("/login");
    }
  }, [isVerified, navigate]);

  return (
    <>
      <Nav />
      <div className={`post-container ${!post ? 'loading' : ''}`}>
        {post ? (
          <>
            <div className="post-title-container">
              <h1>{post.title}</h1>
              <div className="author-container">
                <p>
                  Posted By: {post.postedBy}
                </p>
                <p>
                  Posted At: {post.postedAt}
                </p>
              </div>
            </div>
            <div className="post-detail-container">
              <div className="tag-container">
                <p>
                  {post.tags ? post.tags.join(", ") : "No Tags"}
                </p>
              </div>
            </div>
            <div className="content">
              <p dangerouslySetInnerHTML={{ __html: post.content }}></p>
            </div>
          </>
        ) : (
          <ClipLoader
            className="spinner"
            color="#ffffff"
            size={150}
          />
        )}
      </div>
    </>
  )
}

export default Post;
