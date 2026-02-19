import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";




function Card({ id, img, title, category, availableqty, description, imgname, addby }) {
    const MemberID = localStorage.getItem("userId")
    const isAdmin = localStorage.getItem("isAdmin")
    const [isBorrow, setIsBorrow] = useState(false)


    const navigate = useNavigate();

    const handleError = (err) =>
        toast.error(err, {
            position: "bottom-left",
        });
    const handleSuccess = (msg) =>
        toast.success(msg, {
            position: "bottom-right",
        });
    const deleteBook = async () => {
        try {

            let { data } = await axios.delete(`http://localhost:3000/book/${id}/${MemberID}`)
            const { success, message } = data;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
                setIsBorrow(true)

            } else {
                handleError(message);
            }
        } catch (error) {
            const message =
                error?.response?.data?.message || "Something went wrong";

            handleError(message);
        }
    }


    const setToPending = async () => {
        try {
            const { data } = await axios.post(
                `http://localhost:3000/pending/${id}`,
                { MemberID },
            );
            const { success, message } = data;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
                setIsBorrow(true)

            } else {
                handleError(message);
            }
        } catch (error) {
            const message =
                error?.response?.data?.message || "Something went wrong";

            handleError(message);
        }
    }
    return (
        <div className="card" style={{ width: "18rem" }}>
            <img src={img} className="card-img-top card-img" alt={imgname} style={{ height: "200px", objectFit: "contain" }} />

            <span className="badge">
                Qty : {availableqty}
            </span>
            <div className="card-body">
                <p className="card-title" style={{ fontSize: "18px" }}>Title : <span style={{ fontWeight: "600" }}>{title}</span></p>
                <p className="card-text">Description : {description}</p>
                <p className="card-title">Category : {category}</p>


                {isBorrow ? <button type="button" className="btn btn-success">Borrowed</button> : isAdmin == "users" ? <a href="#" className="btn btn-primary" onClick={setToPending} style={{ marginRight: "5px" }}>Add to Borrow</a> : ""}
                {MemberID == addby ? <button type="button" className="btn btn-danger" onClick={deleteBook}>Delete</button> : ""}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Card



