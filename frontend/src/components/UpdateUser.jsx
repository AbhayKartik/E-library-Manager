import axios from 'axios';
import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io';
import { toast, ToastContainer } from 'react-toastify';

const UpdateUser = ({ setIsUpdateFormOpen }) => {
    let id = localStorage.getItem("userId")
    let SignUpUrl = `http://localhost:3000/updateuser/${id}`

    let [inputValue, setInputValue] = useState({
        email: "",
        password: "",
        address: "",
        contact: '',
    });
    const { email, password, address, contact } = inputValue;
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
            const isAdmin = localStorage.getItem("isAdmin")

            const { data } = await axios.put(
                SignUpUrl,
                {
                    ...inputValue, isAdmin
                },
            );
            const { success, message } = data;

            if (success) {
                handleSuccess(message);
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
            address: "",
            contact: "",
        });
    }
    return (
        <div className="row mt-3" style={{ position: "absolute", width: "80vw", top: "60px", zIndex: "2000", left: "250px" }}>
            <div className="col-6 offset-3">
                <form onSubmit={handleSubmit} style={{ backgroundColor: "#ecf0f6", padding: "40px", borderRadius: "20px" }} >


                    <IoMdClose onClick={() => setIsUpdateFormOpen(false)} style={{ cursor: "pointer", fontSize: "20px", top: "2px" }} />


                    <h5 className="col-6 offset-3 mb-4 mt-3 mx-4 ">Update Profile</h5>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-lable">Update Email</label>
                        <input type="text" id="email" name="email" className="form-control" placeholder="name@youremail.com" value={email} onChange={handleOnChange} required />
                        <div className="invalid-feedback">Please Enter Email id</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Update password</label>
                        <input type="password" id="password" name="password" className="form-control" placeholder="••••••••" required value={password} onChange={handleOnChange} />
                        <div className="invalid-feedback">Please Enter password</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="contact" className="form-lable">Update Contact</label>
                        <input type="tel" id="contact" name="contact" className="form-control" placeholder="123-45-678" required value={contact} onChange={handleOnChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-lable"> Update Address</label>
                        <textarea id="address" rows="3" name="address" className="form-control" placeholder="Write your address here..." value={address} onChange={handleOnChange} required></textarea>
                    </div>

                    <button className="btn btn-primary">Update</button>
                </form>

            </div>
            <ToastContainer />
        </div>
    )
}

export default UpdateUser
