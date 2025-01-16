import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Setcookie from "./Cookies";
import * as jose from 'jose'
type User = {
  Username: string;
  Password: string;
};

const LoginModal = ({ isOpen, toggleModal, onLoginSuccess }) => {
  const [user, setUser] = useState<User>({ Username: "", Password: "" });
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;


    
  const handleInputChange = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const sendLogin=async()=>{
    let response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/Auth`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
  });
  if (!response.ok) {
    if (response.status === 401) {
       onLoginSuccess(false)
    } else {
        throw new Error('Network response was not ok');
    }
} else {
    let jwt = await response.text();
    const claims = jose.decodeJwt(jwt);
    console.log(claims.exp);
    const rfc2822 = new Date(claims.exp * 1000).toUTCString();
    Setcookie(jwt, rfc2822)
    onLoginSuccess(true)
    toggleModal();
}
  }


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm"
      onClick={() => toggleModal(false)}
    >
      <div
        className="w-1/4 bg-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Card>
          <CardHeader>
            <CardTitle>Login bucko :3</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Username</Label>
            <Input
              value={user.Username || ""}
              onChange={(e) => handleInputChange("Username", e.target.value)}
              className="mb-3"
            />
            <Label>Password</Label>
            <div className="relative">
              <Input
                value={user.Password || ""}
                onChange={(e) => handleInputChange("Password", e.target.value)}
                type={showPassword ? "text" : "password"}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
            <div className="mt-4 flex w-full justify-center">
              <Button className="bg-white transition ease-in-out duration-300 hover:bg-primary/90 text-black"
              onClick={sendLogin}>
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginModal;
