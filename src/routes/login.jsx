// H:/LibrarySystem/src/routes/login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button.jsx";
import { Input } from "../components/input.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card.jsx";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Library System Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
            />
            <Input
              type="password"
              placeholder="Password"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
