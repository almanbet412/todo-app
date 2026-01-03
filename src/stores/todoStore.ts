import { create } from "zustand";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/utils/firebase";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Timestamp;
};

type TodoStore = {
  todos: Todo[];
  loading: boolean;
  addTodo: (text: string) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, newText: string) => Promise<void>;
  toggleCompleted: (id: string) => Promise<void>;
  loadTodos: () => () => void;
};

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  loading: false,

  addTodo: async (text: string) => {
    const user = auth.currentUser;
    if (!user || !text.trim()) return;
    set({ loading: true });
    try {
      await addDoc(collection(db, `users/${user.uid}/todos`), {
        text: text.trim(),
        completed: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      set({ loading: false });
    }
  },

  removeTodo: async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;
    set({ loading: true });
    try {
      await deleteDoc(doc(db, `users/${user.uid}/todos`, id));
    } catch (error) {
      console.error("Error removing todo:", error);
    } finally {
      set({ loading: false });
    }
  },

  updateTodo: async (id: string, newText: string) => {
    const user = auth.currentUser;
    if (!user || !newText.trim()) return;
    set({ loading: true });
    try {
      await updateDoc(doc(db, `users/${user.uid}/todos`, id), {
        text: newText.trim(),
      });
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      set({ loading: false });
    }
  },

  toggleCompleted: async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;
    set({ loading: true });
    try {
      const todo = useTodoStore.getState().todos.find((t) => t.id === id);
      if (todo) {
        await updateDoc(doc(db, `users/${user.uid}/todos`, id), {
          completed: !todo.completed,
        });
      }
    } catch (error) {
      console.error("Error toggling completed:", error);
    } finally {
      set({ loading: false });
    }
  },

  loadTodos: () => {
    const user = auth.currentUser;
    if (!user) {
      set({ todos: [], loading: false });
      return () => {};
    }
    set({ loading: true });
    const q = query(collection(db, `users/${user.uid}/todos`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todos: Todo[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        completed: doc.data().completed ?? false,
        createdAt: doc.data().createdAt || null,
      }));
      // Сортировка: незавершённые сверху (по createdAt desc), завершённые снизу (по createdAt desc)
      todos.sort((a, b) => {
        // 1. Незавершённые сверху
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        // 2. Если обе завершены или обе нет — сортируем по дате (новые сверху)
        const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt ? b.createdAt.toMillis() : 0;

        return timeB - timeA; // Новые сверху
      });
      set({ todos, loading: false });
    });
    return unsubscribe;
  },
}));
