import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
	const navigate = useNavigate();

	const handleLogout = async () => {
		const response = await axios.post("logout", {}, { withCredentials: true });

		if (response.data.success) {
			navigate("/login");
			navigate(0);
			return;
		}
	};

	return (
		<nav>
			<ul>
				<li>
					<strong>
						<Link to='/'>Todo App</Link>
					</strong>
				</li>
			</ul>
			<ul>
				<li>
					<Link to='/register'>Sign Up</Link>
				</li>
				<li>
					<Link to='/login'>Login</Link>
				</li>
				<li>
					<button onClick={handleLogout}>Logout</button>
				</li>
			</ul>
		</nav>
	);
}
