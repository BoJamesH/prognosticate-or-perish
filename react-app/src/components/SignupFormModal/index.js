import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [errors, setErrors] = useState({});

  const { closeModal } = useModal();

  // Email validation pattern
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  // Validation function
  const validate = () => {
    const newErrors = {};

    if (username.length > 20 || username.length < 3) {
      newErrors.username = "Username should be between 3 and 20 characters.";
    }

    if (password.length < 8) {
      newErrors.password = "Password should be 8 characters or more.";
    }

    if (!email.match(emailPattern)) {
      newErrors.email = "Invalid email address.";
    }

    setErrors(newErrors);
  };

  // Run validation on input change
  const handleUsernameChange = (value) => {
    setUsername(value);
    validate();
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    validate();
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    validate();
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    validate();
  };

  const handleProfileImgUrlChange = (value) => {
    setProfileImgUrl(value);
    validate();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
	const newErrors = {};
	if (password.trim() !== confirmPassword.trim()) {
		newErrors.confirmPassword = "Passwords do not match.";
		setErrors(newErrors)
		return
	}
    if (Object.keys(errors).length === 0) {
      const data = await dispatch(
        signUp(
          username.replace(/\s/g, ""),
          email.replace(/\s/g, ""),
          password.replace(/\s/g, ""),
          profileImgUrl.replace(/\s/g, "")
        )
      );

      if (data) {
        setErrors({ general: data });
      } else {
        closeModal();
      }
    }
  };

  return (
    <>
      <div className="signup-form-overall-div">
        <h1>Sign Up</h1>
        <form className="signup-form-form" onSubmit={handleSubmit}>
          <ul>
            {errors.general && <li>{errors.general}</li>}
          </ul>
            <label>*Username</label>
          <div className="form-input">
            <input
              type="text"
              value={username}
              className="signup-form-input-field"
              onChange={(e) => handleUsernameChange(e.target.value)}
              required
            />
            {errors.username && <div className="error">{errors.username}</div>}
          </div>
            <label>*Email</label>
          <div className="form-input">
            <input
              type="text"
              value={email}
              className="signup-form-input-field"
              onChange={(e) => handleEmailChange(e.target.value)}
              required
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
            <label>Profile Image URL</label>
          <div className="form-input">
            <input
              type="url"
              className="signup-form-input-field"
              value={profileImgUrl}
              onChange={(e) => handleProfileImgUrlChange(e.target.value)}
            />
          </div>
            <label>*Password</label>
          <div className="form-input">
            <input
              type="password"
              className="signup-form-input-field"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
            <label>*Confirm Password</label>
          <div className="form-input">
            <input
              type="password"
              className="signup-form-input-field"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              required
            />
            {errors.confirmPassword && (
              <div className="error">{errors.confirmPassword}</div>
            )}
          </div>
          <button className="signup-submit-button" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
}

export default SignupFormModal;
