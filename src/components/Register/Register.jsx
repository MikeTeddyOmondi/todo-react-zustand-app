import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function Register() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [navigate, setNavigate] = useState(false);

	const handleRegistration = async (e) => {
		e.preventDefault();

		const response = await axios.post("register", {
			username,
			email,
			password,
		});

		if (response.request.status === 500) {
			setError(response.response.data.message);
		} else if (response.data.success) {
			setNavigate(true);
		}
	};

	if (navigate) {
		return <Navigate to='/login' />;
	}

	return (
		<>
			<main className='container main'>
				<article className='grid'>
					<div>
						<hgroup>
							<h1>Register</h1>
							<center>{error ? <h6>{error}</h6> : ""}</center>
						</hgroup>
						<form onSubmit={handleRegistration}>
							<input
								type='text'
								name='username'
								placeholder='Username'
								aria-label='Username'
								autoComplete='username'
								onChange={(e) => setUsername(e.target.value)}
							/>
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
								Register
							</button>
						</form>
					</div>
				</article>
			</main>
		</>
	);
}
