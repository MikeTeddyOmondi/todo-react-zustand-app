import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTodosStore } from "../../stores/useTodoStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, CheckCircle2 } from "lucide-react";

const Todos = () => {
  const [username, setUsername] = useState("");
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

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
      } catch (_err) {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        navigate("/login", { replace: true });
      }
    })();
  }, [username, navigate]);

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="mb-2 text-3xl font-bold">Hi {username}</h2>
          <Alert className="mb-4 bg-muted">
            <AlertDescription>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio dicta voluptates
              aperiam, autem exercitationem error.
            </AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground">Total: {todos.length}</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter a new todo..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                className="flex-1"
              />
              <Button onClick={addTodo}>Add</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {todos.length !== 0 ? (
            todos.map((todo, index) => (
              <Card key={index} className={isLoading ? "opacity-50" : ""}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <p className={todo.completed ? "line-through text-muted-foreground" : ""}>
                      {todo.title}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => updateTodo(todo.id)}>
                        <CheckCircle2
                          className={`h-5 w-5 ${
                            todo.completed ? "text-green-600" : "text-gray-400"
                          }`}
                        />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Currently there are no todos. Enter a new todo...
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
export default Todos;
