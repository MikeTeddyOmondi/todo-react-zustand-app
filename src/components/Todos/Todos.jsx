import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useTodosStore } from "../../stores/useTodoStore";
import "boxicons";
import "./Todos.css";

const Todos = () => {
	const [username, setUsername] = useState("");
	const [navigate, setNavigate] = useState(false);
	const [inputValue, setInputValue] = useState("");

	const todos = useTodosStore((state) => state.data);
	const getTodos = useTodosStore((state) => state.getTodos);
	const createTodo = useTodosStore((state) => state.createTodo);
	const updateTodo = useTodosStore((state) => state.updateTodo);
	const deleteTodo = useTodosStore((state) => state.deleteTodo);
	const isLoading = useTodosStore((state) => state.isLoading);

	const addTodo = () => {
		if (inputValue === "") {
			return;
		}
		let todo = inputValue.trim();
		createTodo(todo);
		setInputValue("");
	};

	useEffect(() => {
		getTodos();
	}, [getTodos]);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get("user");
				setUsername(data.data.user.username);
			} catch (err) {
				setNavigate(true);
			}
		})();
	}, [username]);

	if (navigate) {
		return <Navigate to='/login' />;
	}

	return (
		<div>
			<h5>Hi {username}</h5>
			<article className=''>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio dicta
				voluptates aperiam, autem exercitationem error.
			</article>
			<div>Total: {todos.length}</div>
			<div>
				<input
					type='text'
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<button onClick={addTodo}>Add</button>
			</div>
			<div>
				{todos.length !== 0 ? (
					todos.map((todo, index) => (
						<article aria-busy={isLoading ? "true" : "false"} key={index}>
							{todo.completed ? (
								<p>
									<s>{todo.title}</s>
								</p>
							) : (
								<p>{todo.title}</p>
							)}
							<box-icon
								color='red'
								type='solid'
								name='trash-alt'
								class='box-icon'
								onClick={() => deleteTodo(todo.id)}></box-icon>
							<box-icon
								color={todo.completed ? "green" : "gray"}
								type='solid'
								name='check-circle'
								class='box-icon'
								onClick={() => updateTodo(todo.id)}></box-icon>
						</article>
					))
				) : (
					<article>Currently there are no todos. Enter a new todo...</article>
				)}
			</div>
		</div>
	);
};
export default Todos;
