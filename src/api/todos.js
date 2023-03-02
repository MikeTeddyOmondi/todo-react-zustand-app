import axios from "axios";

export const getTodos = () => axios.get("http://localhost:5000/todos");

export const createTodo = (title) => {
	return axios.post("http://localhost:5000/todos", { title, completed: false });
};

export const updateTodo = (id) => {
	return axios.patch(`http://localhost:5000/todos/${id}`, { completed: true });
};

export const deleteTodo = (id) => {
	return axios.delete(`http://localhost:5000/todos/${id}`);
};
