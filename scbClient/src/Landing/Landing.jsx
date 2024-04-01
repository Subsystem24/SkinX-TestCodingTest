import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <>
      <div className="btnContainer">
        <div className="regisBtn">
          <Link to="/register">
            <button>
              Register
            </button>
          </Link>
        </div>
        <div className="loginBtn">
          <Link to="/login">
            <button>
              Login
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Landing
