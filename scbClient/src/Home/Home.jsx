import Nav from "../Nav/Nav";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Home.css";
import Select from "react-dropdown-select";
import TextField from "@mui/material/TextField";

function Home() {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(null);
  const [posts, setPosts] = useState([]);
  const [inputText, setInputText] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState("directive");

  let inputHandler = (e) => {
    const lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
    console.log(inputText);
  };

  let tagSelectHandler = (e) => {
    const lowerCase = e.target.value.toLowerCase();
    setSelectedTags(lowerCase);
    console.log(selectedTags);
  };

  const options = [
    {
      value: "Default",
      label: 'Default'
    },
    {
      value: "postedDate_DESC",
      label: 'Posted Date DESC'
    },
    {
      value: "postedDate_ASC",
      label: 'Posted Date ASC'
    },
    {
      value: "title_A-Z",
      label: 'Title A-Z'
    },
    {
      value: "title_Z-A",
      label: 'Title Z-A'
    }
  ];

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const response = await axios.post('http://localhost:3333/home', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        if (response.status === 200) {
          setIsVerified(true);
          setPosts(response.data.posts);
          setTags(response.data.tags)
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        console.error('Verification failed:', error);
        setIsVerified(false);
      }
    };

    verifyAccess();
  }, []);

  useEffect(() => {
    if (isVerified === false) {
      alert("Please Login");
      navigate("/login");
    }
  }, [isVerified, navigate]);

  return(
    <>
      <Nav />
      <div className="search_bar">
        <h1>Posts</h1>
        <div className="search">
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            label="Search"
            color="secondary"
            focused
            placeholder="Title / Author"
            InputProps={{
              sx: {
                color: 'white',
              }
            }}
            onChange={inputHandler}
          />
        </div>
        <h2>Tags</h2>
        <select onChange={tagSelectHandler}>
          <option value="no-tags">-</option>
          {tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
      <div className="sort-container">
        <p>Sorted By</p>
        <Select options={options} onChange={(values) => {
          console.log(values[0].value);
          axios.post('http://localhost:3333/home', { sortedBy: values[0].value }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
          })
          .then(response => {
            setPosts(response.data.posts);
          })
          .catch(error => {
            console.error('Error fetching sorted articles:', error);
          });
        }} className="dropdown"/>
      </div>
      <div className="content-container">
        <div className="posts-container">
          {posts.filter(post =>
            (selectedTags === 'no-tags' || post.tags.includes(selectedTags)) &&
            (inputText === '' || post.title.toLowerCase().includes(inputText.toLowerCase()) || post.postedBy.toLowerCase().includes(inputText.toLowerCase()))
          ).map((post) => (
            <div key={post.id} className="post">
              <div className="post-title">
                <Link to={`/post/${post.id}`}>
                  {post.title}
                </Link>
              </div>
              <p>Tags: {post.tags[0] === "no-tags" ? "-" : post.tags.join(', ')}</p>
              <p>Posted By: {post.postedBy}</p>
              <p>Posted At: {post.postedAt.split("T")[0]}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Home;
