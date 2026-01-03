import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/utils/firebase";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (password.length < 6 && !isLogin) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    }
  };

  const getErrorMessage = (code: string): string => {
    switch (code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Неверный email или пароль";
      case "auth/email-already-in-use":
        return "Этот email уже зарегистрирован";
      case "auth/invalid-email":
        return "Некорректный email";
      case "auth/weak-password":
        return "Пароль слишком слабый (минимум 6 символов)";
      default:
        return "Произошла ошибка. Попробуйте позже.";
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card
        className={cn("w-full max-w-md bg-gray-900 border-gray-800 shadow-xl")}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-400">
            {isLogin ? "Вход" : "Регистрация"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <p className="text-red-400 text-center bg-red-900/50 p-3 rounded">
              {error}
            </p>
          )}

          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-gray-800 border-gray-700 text-white"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="pr-10 bg-gray-800 border-gray-700 text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </Button>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-gray-500">
            {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:underline font-medium"
            >
              {isLogin ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
