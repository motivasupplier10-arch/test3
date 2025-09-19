import { LoginPage } from "../LoginPage";

export default function LoginPageExample() {
  const handleLogin = (email: string, password: string) => {
    console.log("Login attempted:", { email, password });
    // Mock authentication success
    alert("Login successful! (This is just a demo)");
  };

  return <LoginPage onLogin={handleLogin} />;
}