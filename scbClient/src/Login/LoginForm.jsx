import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3333/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const token = response.data.token;

      if (token) {
        localStorage.setItem('jwtToken', token);
      } else {
        alert('Login failed');
        navigate("/login")
      }

      if (response.status == 200) {
        navigate('/home');
        alert("Login Successfully");
      } else {
        navigate('/login');
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" />
      <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" />
      <button type="submit">Login</button>
    </form>
    </>
  )
}

export default LoginForm
