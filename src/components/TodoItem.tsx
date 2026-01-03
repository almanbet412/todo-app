"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useTodoStore } from "@/stores/todoStore";

type TodoItemProps = {
  todo: { id: string; text: string; completed: boolean };
};

export default function TodoItem({ todo }: TodoItemProps) {
  const { removeTodo, updateTodo, toggleCompleted } = useTodoStore();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleUpdate = () => {
    if (editText.trim() && editText.trim() !== todo.text) {
      updateTodo(todo.id, editText.trim());
    }
    setIsEditOpen(false);
  };

  const handleOpenEdit = () => {
    setEditText(todo.text);
    setIsEditOpen(true);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditOpen(false);
  };

  return (
    <>
      <li className="group flex items-center justify-between rounded-lg bg-gray-800 p-4 hover:bg-gray-700/70 transition">
        <div className="flex items-center space-x-4 flex-1">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => toggleCompleted(todo.id)}
          />
          <span
            className={`text-lg transition ${
              todo.completed ? "text-gray-500 line-through" : "text-white"
            }`}
          >
            {todo.text}
          </span>
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenEdit}
            className="h-8 w-8 text-gray-400 hover:text-blue-400 hover:bg-gray-600"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeTodo(todo.id)}
            className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-900/30"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </li>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Редактировать задачу</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              autoFocus
              className="bg-gray-800 border-gray-700 focus:border-blue-500"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Отмена
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Обновить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
