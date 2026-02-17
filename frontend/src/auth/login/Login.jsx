import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../Authcontext";
const Login = () => {
    let LogInUrl = "http://localhost:3000/login"
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
    });
    const { email, password } = inputValue;
    let [isAdmin, setIsAdmin] = useState("")
    const { setCurrentUser } = useAuth();
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };

    const handleError = (err) =>
        toast.error(err, {
            position: "bottom-left",
        });
    const handleSuccess = (msg) =>
        toast.success(msg, {
            position: "bottom-left",
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                LogInUrl,
                {
                    ...inputValue, isAdmin
                },
            );
            const { success, message } = data;
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("isAdmin", data.isAdmin);

            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                handleError(message);
            }
            setCurrentUser(data.userId);

        } catch (error) {
            const message =
                error?.response?.data?.message || "Something went wrong";

            handleError(message);
        }
        setInputValue({
            ...inputValue,
            email: "",
            password: "",
        });
        setIsAdmin("")
    };

    return (
        <div className="row mb-10" style={{ position: "absolute", width: "80vw", top: "60px", zIndex: "2000", left: "250px" }}>
            <div className="col-6 offset-3">
                <h5 className="col-6 offset-3 mb-4 mt-3 mx-4 ">Login</h5>
                <form onSubmit={handleSubmit} style={{ backgroundColor: "#ecf0f6", padding: "40px", borderRadius: "20px" }}>
                    <div className="mb-3">
                        <label htmlFor="role" className="form-lable">Select Role :</label>
                        <select id="role" className="form-control" value={isAdmin} onChange={(e) => setIsAdmin(e.target.value)}>
                            <option defaultValue={"users"}>Choose a Role</option>
                            <option value="admin">Admin</option>
                            <option value="users">User</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-lable">Your Email</label>
                        <input type="text" id="email" name="email" className="form-control" placeholder="name@youremail.com" value={email} onChange={handleOnChange} />

                    </div>
                    <div className="mb-3">

                        <label htmlFor="password" className="form-lable">Your password</label>
                        <input type="password" id="password" name="password" className="form-control" placeholder="••••••••" required value={password} onChange={handleOnChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                    <div className="mt-10">
                        Don't Have an account? <Link to={"/signup"}>Signup</Link>
                    </div>
                </form>

            </div>
            <ToastContainer />
        </div>
    );
}

export default Login
