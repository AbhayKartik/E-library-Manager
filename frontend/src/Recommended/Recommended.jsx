import { Link } from "react-router-dom"
import Button from "../components/Button"
import "./Recommended.css"

function Recommended({ handleClick }) {
    return <>
        <div>
            <h2 className="recommended-title">Recommended</h2>
            <div className="recommended-flex">
                <Link to={"/"} style={{ textDecoration: "none", color: "black" }}>
                    <Button title="All Books" />
                </Link>
                <Button onClickHandler={handleClick} value="History" title="History" />
                <Button onClickHandler={handleClick} value="Science" title="Science" />
                <Button onClickHandler={handleClick} value="Finance" title="Finance" />
                <Button onClickHandler={handleClick} value="Physics" title="Physics" />
            </div>
        </div>
    </>
}

export default Recommended
