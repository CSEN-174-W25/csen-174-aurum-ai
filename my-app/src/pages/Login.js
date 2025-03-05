import { login } from "../firebase/authService";

const Login = () => {
    const handleLogin = async () => {
        const email = "test@example.com";
        const password = "password123";
        await login(email, password);
    };

    return <button onClick={handleLogin}>Login & Fetch Data</button>;
};

export default Login;
