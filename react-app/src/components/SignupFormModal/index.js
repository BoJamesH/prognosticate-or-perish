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
	const [profileImgUrl, setprofileImgUrl] = useState("");
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (username.length > 20) {
			setErrors(["Username should be 20 characters or less",])
			return
		}
		if (password === confirmPassword) {
			const data = await dispatch(signUp(username.replace(/\s/g, ''), email.replace(/\s/g, ''), password.replace(/\s/g, ''), profileImgUrl.replace(/\s/g, '')));
			if (data) {
				setErrors(data);
			} else {
				closeModal();
			}
		} else {
			setErrors([
				"Confirm Password field must be the same as the Password field",
			]);
		}
	};

	return (
		<>
		<div className="signup-form-overall-div">
			<h1>Sign Up</h1>
			<form className="signup-form-form" onSubmit={handleSubmit}>
				<ul>
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
				<label>
					Email
				</label>
					<input
						type="text"
						value={email}
						className="signup-form-input-field"
						onChange={(e) => setEmail(e.target.value)}
						required
						/>
				<label>
					Username
				</label>
					<input
						type="text"
						value={username}
						className="signup-form-input-field"
						onChange={(e) => setUsername(e.target.value)}
						required
						/>
				<label>
					Profile Image URL
				</label>
					<input
						type="url"
						className="signup-form-input-field"
						value={profileImgUrl}
						onChange={(e) => setprofileImgUrl(e.target.value)}
						/>
				<label>
					Password
					</label>
					<input
						type="password"
						className="signup-form-input-field"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						/>
				<label>
					Confirm Password
				</label>
					<input
						type="password"
						className="signup-form-input-field"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						/>
				<button className='signup-submit-button' type="submit">Sign Up</button>
			</form>
			</div>
		</>
	);
}

export default SignupFormModal;
