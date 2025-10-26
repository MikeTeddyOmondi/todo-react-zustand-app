import { create } from "zustand";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../api/todos";

export const useTodosStore = create((set, get) => ({
  data: [],
  isLoading: false,
  error: null,
  getTodos: async () => {
    try {
      set({ isLoading: true });
      const response = await getTodos();
      set({ isLoading: false, data: response.data });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
  createTodo: async (name) => {
    try {
      set({ isLoading: true });
      const response = await createTodo(name);
      const updatedData = [...get().data, response.data];
      set({ isLoading: false, data: updatedData });
      // set((state) => ({
      //   isLoading: false,
      //   data: [...state.data, response.data],
      // }));
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
  updateTodo: async (id) => {
    try {
      set({ isLoading: true });
      await updateTodo(id);
      const res = await getTodos();
      set({ isLoading: false, data: res.data });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
  deleteTodo: async (id) => {
    try {
      set({ isLoading: true });
      await deleteTodo(id);
      const updatedData = get().data.filter((todo) => todo.id !== id);
      set({ isLoading: false, data: updatedData });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
