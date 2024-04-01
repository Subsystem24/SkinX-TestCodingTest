import "./Nav.css";
import { Link } from "react-router-dom";

function Nav() {
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
  }
  return (
    <>
      <style>
        @import url(`https://fonts.googleapis.com/css2?family=Gabarito:wght@400..900&display=swap`)
      </style>
      <nav>
        <div className="logo-container">
          <Link className="logo" to="/">scbX</Link>
        </div>
        <div className="link-container">
          <Link to="/home">Home</Link>
          <Link to="/login" onClick={handleLogout}>Log out</Link>
        </div>
      </nav>
    </>
  )
}

export default Nav;
