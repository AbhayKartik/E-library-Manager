import { Link } from "react-router-dom"
import Input from "../../components/Input"
import "./Category.css"
function Category({ handleChange }) {
    return (
        <div>
            <h2 className="sidebar-title">Category</h2>

            <div>
                <label className="sidebar-label-container">
                    <input type="radio" name="test" value="" onChange={handleChange} />
                    <span className="checkmark"></span>All
                </label>

                <Input handleChange={handleChange} value="SelfHelp" title="Self-Help" name="test" />
                <Input handleChange={handleChange} value="Technology" title="Technology" name="test" />
                <Input handleChange={handleChange} value="Business" title="Business" name="test" />
                <Input handleChange={handleChange} value="History" title="History" name="test" />
                <Input handleChange={handleChange} value="Finance" title="Finance" name="test" />
                <Input handleChange={handleChange} value="Science" title="Science" name="test" />
                <Input handleChange={handleChange} value="Physics" title="Physics" name="test" />
            </div>
        </div>
    )
}

export default Category
