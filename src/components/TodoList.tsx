"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import TodoItem from "./TodoItem";
import AuthForm from "./AuthForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card"; // Импортируем из твоего примера
import { Button } from "./ui/button"; // Из твоего примера
import { cn } from "@/lib/utils"; // Из твоего примера
import { useTodoStore } from "@/stores/todoStore";
import TableColumn from "./TableColumn";

export default function TodoList() {
  const { todos, addTodo, loadTodos, loading } = useTodoStore();
  const [newTodo, setNewTodo] = useState("");
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [accordionOpen, setAccordionOpen] = useState(false);

  const itemsPerPage = 10;
  const visibleTodos = todos.slice(0, 5);
  const accordionTodos = todos.slice(5, 10);
  const paginatedTodos = todos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) loadTodos();
    });
    return unsubscribe;
  }, [loadTodos]);

  const handleAdd = () => {
    if (newTodo.trim() && user) {
      addTodo(newTodo.trim());
      setNewTodo("");
    }
  };

  const totalPages = Math.ceil(todos.length / itemsPerPage);

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <Card
        className={cn(
          "max-w-4xl mx-auto bg-gray-900 border-gray-800 shadow-xl"
        )}
      >
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-xl font-bold text-blue-400">
            Todo List
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut(auth)}
            className="text-gray-400 hover:text-gray-800"
          >
            Выйти
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Новая задача..."
              className="flex-1 bg-transparent border-none px-4 py-3 text-white placeholder-gray-500 focus:outline-none"
            />
            <Button
              onClick={handleAdd}
              variant="default"
              size="default"
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              Добавить
            </Button>
          </div>

          {loading && <TableColumn />}

          <ul className="space-y-2">
            {todos.length <= 10 ? (
              <>
                {visibleTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
                {accordionTodos.length > 0 && (
                  <div className="mt-4">
                    <Button
                      onClick={() => setAccordionOpen(!accordionOpen)}
                      className="w-full justify-between text-gray-400 bg-gray-900 hover:bg-gray-800"
                    >
                      {accordionOpen
                        ? "Скрыть дополнительные"
                        : "Показать дополнительные задачи"}
                      <span>{accordionOpen ? "▲" : "▼"}</span>
                    </Button>
                    {accordionOpen &&
                      accordionTodos.map((todo) => (
                        <div key={todo.id} className="mt-2">
                          <TodoItem key={todo.id} todo={todo} />
                        </div>
                      ))}
                  </div>
                )}
              </>
            ) : (
              paginatedTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))
            )}
            {todos.length === 0 && !loading && (
              <p className="text-gray-500 text-center py-4">
                Нет задач. Добавьте первую!
              </p>
            )}
          </ul>
        </CardContent>

        {todos.length > 10 && (
          <CardFooter className="flex justify-center space-x-2 border-t border-gray-800 pt-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="text-gray-400 hover:text-white disabled:opacity-50"
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "ghost"}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="ghost"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="text-gray-400 hover:text-white disabled:opacity-50"
            >
              Next
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
