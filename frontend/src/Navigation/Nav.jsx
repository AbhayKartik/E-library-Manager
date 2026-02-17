import { FiHeart } from "react-icons/fi"
import "./Nav.css"
import { AiOutlineUserAdd, AiOutlineShoppingCart } from "react-icons/ai"
import axios from "axios"
import { useEffect, useState } from "react"
import Profile from "../components/profile/Profile"
import { useAuth } from "../Authcontext";

function Nav({ query, handleInputChange }) {
    const [username, setUserName] = useState("")
    const isAdmin = localStorage.getItem("isAdmin")
    const [isProfileOpen, setIsprofileOpen] = useState(false)
    const { setCurrentUser } = useAuth();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("isAdmin");
        setCurrentUser(null);

        window.location.href = "/auth";
    }

    useEffect(() => {
        const getUser = async () => {
            const userId = localStorage.getItem("userId")
            try {
                let { data } = await axios.get(`http://localhost:3000/userprofile/${userId}`)
                setUserName(data.username)

            } catch (error) {
                console.error("Error in Nav", error)
            }
        }
        getUser()
    }, [])
    return (
        <nav className="container">
            <div className="row">
                <div className="nav-container col">
                    <input type="text" value={query} onChange={handleInputChange} placeholder="Enter Your Seacrh Book" className="search-input" />
                </div>
                <div className="profile container col">



                    <span style={{ position: "absolute", right: "80px", cursor: "pointer" }}>
                        <a className="nav-icons" onClick={() => setIsprofileOpen(true)}>
                            <AiOutlineUserAdd style={{ fontSize: "30px" }} />

                            {username}
                        </a>

                    </span>


                </div>
                {isProfileOpen ? <Profile isAdmin={isAdmin} username={username} logout={logout} setIsprofileOpen={setIsprofileOpen} />
                    : ""
                }
            </div>

        </nav>
    )
}

export default Nav
