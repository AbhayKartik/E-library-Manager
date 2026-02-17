
import axios from 'axios';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";


const AddBook = ({ setIsFormOpen }) => {
    const navigate = useNavigate();
    let userid = localStorage.getItem("userId")
    const [inputValue, setInputValue] = useState({
        title: "",
        author: "",
        category: "",
        availableqty: "",
        description: "",
    });

    const [imgurl, setImgurl] = useState(null);
    const handleFileChange = (e) => {
        setImgurl(e.target.files[0]); // first selected file
    };
    const { title, author, category, availableqty, description, } = inputValue;

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

            const formData = new FormData();

            formData.append("imgurl", imgurl);
            formData.append("title", title);
            formData.append("author", author);
            formData.append("category", category);
            formData.append("availableqty", availableqty);
            formData.append("description", description);
            const { data } = await axios.post(
                `http://localhost:3000/addbook/${userid}`, formData

            );
            const { success, message } = data;
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
            title: "",
            author: "",
            category: "",
            availabelqty: "",
            description: "",
        });
        setImgurl(null)
    };


    return (
        <div className="row mb-10 " style={{ position: "absolute", width: "80vw", top: "120px", zIndex: "2000", left: "350px" }}>
            <div className="col-6 offset-3">
                <form onSubmit={handleSubmit} style={{ backgroundColor: "#ecf0f1", padding: "40px", borderRadius: "20px" }}>
                    <span onClick={() => setIsFormOpen(false)} style={{ cursor: "pointer" }}>

                        <IoMdClose style={{ fontSize: "30px", }} />
                    </span>
                    <h5 className="col-6 offset-3 mb-4 mt-3 mx-4 " style={{ fontSize: "20px", }}>Add New Book</h5>
                    <div className="mb-3">
                        <label htmlFor='title' className="form-label" >Book Title</label>
                        <input type="text" className="form-control" placeholder='Enter Book Title' name='title' value={title} onChange={handleOnChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor='category'>Category</label>
                        <select type="text" className="form-control" name='category' value={category} onChange={handleOnChange}  >
                            <option defaultValue={"SelfHelp"}>Choose a Category</option>
                            <option value="SelfHelp">Self-Help</option>
                            <option value="Technology">Technology</option>
                            <option value="Business">Business</option>
                            <option value="History">History</option>
                            <option value="Finance">Finance</option>
                            <option value="Science">Science</option>
                            <option value="Physics">Physics</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor='description'>Description</label>
                        <input type="text" className="form-control" name='description' placeholder='Enter Book Description' value={description} onChange={handleOnChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor='author'>Author</label>
                        <input type="text" className="form-control" name='author' placeholder='Author Name' value={author} onChange={handleOnChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor='imgurl'>Image</label>
                        <input type="file" className="form-control" name='imgurl' onChange={handleFileChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor='availableqty'>Quantity</label>
                        <input type="number" className="form-control" placeholder='Enter Quantity' name='availableqty' value={availableqty} onChange={handleOnChange} />
                    </div>
                    <button type="submit" className="btn btn-success mt-3">Add Book</button>

                </form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default AddBook
