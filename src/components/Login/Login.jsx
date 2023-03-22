import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [navigate, setNavigate] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();

		const response = await axios.post(
			"login",
			{
				email,
				password,
			},
			{ withCredentials: true },
		);

		if (response.request.status === 500 || response.request.status === 400) {
			setEmail("");
			setPassword("");
			return setError(response.response.data.message);
		} else if (response.data.success) {
			axios.defaults.headers.common[
				"Authorization"
			] = `Bearer ${response.data.data.token}`;
			return setNavigate(true);
		}
	};

	if (navigate) {
		return <Navigate to='/' />;
	}

	return (
		<>
			<main className='container main'>
				<article className='grid'>
					<div>
						<hgroup>
							<h1>Login</h1>
							<center>{error ? <h6>{error}</h6> : ""}</center>
						</hgroup>
						<form onSubmit={handleLogin}>
							<input
								type='email'
								name='email'
								placeholder='Email'
								aria-label='Email'
								autoComplete='email'
								onChange={(e) => setEmail(e.target.value)}
							/>
							<input
								type='password'
								name='password'
								placeholder='Password'
								aria-label='Password'
								autoComplete='current-password'
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button type='submit' className='contrast'>
								Login
							</button>
						</form>
					</div>
				</article>
			</main>
		</>
	);
}
