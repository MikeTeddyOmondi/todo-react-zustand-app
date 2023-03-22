import "./App.css";
import Header from "./components/Header/Header";
import Todos from "./components/Todos/Todos";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { Routes, Route } from "react-router-dom";

function App() {
	return (
		<div className='App'>
			<main className='container'>
				<Header />

				<Routes>
					<Route exact path='/' element={<Todos />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
