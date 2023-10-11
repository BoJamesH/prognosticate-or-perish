import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useHistory } from "react-router-dom";

function LoginFormModal() {
  const history = useHistory()
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
        history.push('/')
        closeModal()

    }
  };

  const handleDemoUserOneLogin = async () => {
    const data = await dispatch(login('demo1@aa.io', 'password'));
    if (data) {
      setErrors(data);
    } else {
      history.push('/')
      closeModal()
    }
  }

  const handleDemoUserTwoLogin = async () => {
    const data = await dispatch(login('demo2@aa.io', 'password'));
    if (data) {
      setErrors(data);
    } else {
      history.push('/')
      closeModal()
    }
  }

  return (
    <>
      <div className="login-form-container">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <div className="email-login-div">
            <label>Email</label>
            <input
            className="email-login-field"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="password-login-div">
            <label>Password</label>
            <input
            className="password-login-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className='login-submit-button' type="submit">Log In</button>
          <div className="demo-user-login" onClick={handleDemoUserOneLogin}>Demo User 1</div>
          <div className="demo-user-login" onClick={handleDemoUserTwoLogin}>Demo User 2</div>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
