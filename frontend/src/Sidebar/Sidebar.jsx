import { FaOpencart } from "react-icons/fa"
import Category from "./Category/Category"
import "./Sidebar.css"
function Sidebar({ handleChange }) {
    return <>
        <section className="sidebar">
            <div className="logo-container">
                <img src="./LMS.png" alt="" style={{ height: "150px", width: "200px" }} />
            </div>
            <Category handleChange={handleChange} />
        </section>
    </>
}

export default Sidebar
