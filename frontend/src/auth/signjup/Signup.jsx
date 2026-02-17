import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../Authcontext"
const Signup = () => {
    let SignUpUrl = "http://localhost:3000/signup"
    const navigate = useNavigate();
    let [inputValue, setInputValue] = useState({
        email: "",
        password: "",
        username: "",
        address: "",
        contact: '',
    });
    const [isAdmin, setIsAdmin] = useState("")
    const { setCurrentUser } = useAuth();
    const { email, password, username, address, contact } = inputValue;
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
            position: "bottom-right",
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                SignUpUrl,
                {
                    ...inputValue, isAdmin
                },
            );
            const { success, message } = data;
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("isAdmin", data.isAdmin);
            setCurrentUser(data.userId);
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                handleError(message);
            }
        } catch (error) {
            const message =
                error?.response?.data?.message || "Something went wrong";

            handleError(message);
        }
        setInputValue({
            ...inputValue,
            email: "",
            password: "",
            username: "",
            address: "",
            contact: "",
        });


    };

    return (
        <div class="row mt-3" style={{ position: "absolute", width: "80vw", top: "60px", zIndex: "2000", left: "250px" }}>
            <div class="col-6 offset-3">
                <h5 class="col-6 offset-3 mb-4 mt-3 mx-4 ">Signup</h5>
                <form onSubmit={handleSubmit} style={{ backgroundColor: "#ecf0f6", padding: "40px", borderRadius: "20px" }} >

                    <div class="mb-3">
                        <label htmlFor="role" className="form-label">Select Role :</label>
                        <select id="role" className="form-control" value={isAdmin} onChange={(e) => setIsAdmin(e.target.value)} required>
                            <option defaultValue={"users"}>Choose a Role</option>
                            <option value="admin">Admin</option>
                            <option value="users">User</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>


                        <input type="text" id="username" name="username" className="form-control" placeholder="Enter username" value={username} onChange={handleOnChange} required />

                        <div class="invalid-feedback">Please Enter Username</div>
                    </div>

                    <div class="mb-3">
                        <label htmlFor="email" className="form-lable">Your Email</label>
                        <input type="text" id="email" name="email" className="form-control" placeholder="name@youremail.com" value={email} onChange={handleOnChange} required />
                        <div class="invalid-feedback">Please Enter Email id</div>
                    </div>

                    <div class="mb-3">
                        <label htmlFor="password" className="form-label">Your password</label>
                        <input type="password" id="password" name="password" className="form-control" placeholder="••••••••" required value={password} onChange={handleOnChange} />
                        <div class="invalid-feedback">Please Enter password</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="contact" className="form-lable">Phone number</label>
                        <input type="tel" id="contact" name="contact" className="form-control" placeholder="123-45-678" required value={contact} onChange={handleOnChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-lable">Address</label>
                        <textarea id="address" rows="3" name="address" className="form-control" placeholder="Write your address here..." value={address} onChange={handleOnChange} required></textarea>
                    </div>

                    <button class="btn btn-primary">SignUp</button>
                    <div>
                        Already have an account? <Link to={"/login"}>Login</Link>
                    </div>
                </form>

            </div>
            <ToastContainer />
        </div>
    );
}

export default Signup
