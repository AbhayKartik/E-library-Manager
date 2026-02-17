import { Link } from "react-router-dom";
import "./profile.css"
import { IoMdClose } from "react-icons/io";
import AddBook from "../AddBook";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import UpdateUser from "../UpdateUser";

const Profile = ({ isAdmin, username, logout, setIsprofileOpen }) => {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false)



    return (
        <div>
            <div className="row profilecard">
                <div>

                    <span className="close">

                        <IoMdClose onClick={() => setIsprofileOpen(false)} style={{ cursor: "pointer" }} />

                    </span>
                    <span className="edit" >
                        <FiEdit onClick={() => setIsUpdateFormOpen(true)} style={{ cursor: "pointer" }} />
                    </span>
                </div>

                {isAdmin == "users" ?
                    <span style={{ position: "relative", backgroundColor: "black", height: "150px", width: "150px", borderRadius: "50%", marginLeft: "120px", marginTop: "-30px", backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRFiFwNozjbXEd6sCy9-AalJDr5OwNZ_2aCw&s')", backgroundSize: "cover", backgroundPosition: "center" }}></span>
                    :
                    <span style={{ position: "relative", backgroundColor: "black", height: "150px", width: "150px", borderRadius: "50%", marginLeft: "120px", marginTop: "-30px", backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaWA6TWhO5NO0dODIIJG8rFUAYeaAYTk-JYQ&s')", backgroundSize: "cover", backgroundPosition: "center" }}></span>

                }


                <h2 style={{ position: "absolute", top: "195px", textDecoration: "underline", }}>{username}</h2>
                {isAdmin == "users" ?
                    <div >
                        <Link to={"/Pendinguserbook"} style={{ textDecoration: "none", color: "black" }}>
                            <div style={{ cursor: "pointer" }} onClick={() => setIsprofileOpen(false)}>
                                See Pending Books
                            </div>
                        </Link>

                        <Link to={"/issuedUserBook"} style={{ textDecoration: "none", color: "black" }}>
                            <div style={{ cursor: "pointer" }} onClick={() => setIsprofileOpen(false)}>
                                See Issued Books
                            </div>
                        </Link>


                    </div> :
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "40px" }}>
                        <div onClick={() => setIsFormOpen(true)} style={{ cursor: "pointer" }}>

                            Add a new Book

                        </div>
                        <Link to={"/issuedBook"} onClick={() => setIsprofileOpen(false)} style={{ textDecoration: "none", color: "black" }}>
                            <div style={{ cursor: "pointer", textDecoration: "none" }} onClick={() => setIsprofileOpen(false)} >
                                Issued book
                            </div>
                        </Link>
                        <Link to={"/pendingIssue"} onClick={() => setIsprofileOpen(false)} style={{ textDecoration: "none", color: "black" }}>
                            <div>
                                Pending book
                            </div>
                        </Link>
                        <Link to={"/handleUser"} onClick={() => setIsprofileOpen(false)} style={{ textDecoration: "none", color: "black" }}>
                            <div>
                                HandleUser
                            </div>
                        </Link>
                    </div>
                }
                <button style={{ margin: "0 180px -10px 80px", padding: "0", height: "50px", width: "250px" }} className="btn btn-danger" onClick={logout}>Logout</button>


            </div>
            {isFormOpen ? <AddBook setIsFormOpen={setIsFormOpen} /> : ""}
            {isUpdateFormOpen ? <UpdateUser setIsUpdateFormOpen={setIsUpdateFormOpen} /> : ""}

        </div>

    )
}

export default Profile
