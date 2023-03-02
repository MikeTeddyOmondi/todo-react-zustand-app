import "./App.css";
import Todos from "./components/Todos";

function App() {
	return (
		<div className='App'>
			<main className='container'>
				<center>
					<h1>Todo App</h1>
				</center>
				<article className=''>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio dicta
					voluptates aperiam, autem exercitationem error soluta repellendus
					rerum, dolores repellat rem voluptas nihil eveniet ex, ducimus quis
					enim magnam tempore.
				</article>
				<Todos />
			</main>
		</div>
	);
}

export default App;
