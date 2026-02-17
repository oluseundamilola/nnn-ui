
import "./login.css";

function Login() {
  return (
    <div className="login-container">
      {/* LEFT SIDE - IMAGE */}
      <div className="login-left">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          alt="Community"
        />
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="login-right">
        <div className="login-box">
          <h1 className="login-title">
            Login into <span>Neighbourlly</span>
          </h1>

          <form className="login-form">
            <div className="input-group">
              <label>Phone or Email</label>
              <input
                type="text"
                placeholder="Enter your phone or email"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <p className="login-footer">
            Don’t have an account? <span>Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
