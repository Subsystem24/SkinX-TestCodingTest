import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterForm() {
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
      const response = await axios.post('http://localhost:3333/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const token = response.data.token;

      if (token) {
        localStorage.setItem('jwtToken', token);
      } else {
        console.log('Login failed');
        navigate("/register")
      }

      navigate('/home');
      alert("Register Successfully");
    } catch (error) {
      alert(error.response.data.message)
      navigate('/register');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" />
      <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" />
      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="First Name" />
      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Last Name" />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
