import { Outlet } from "react-router-dom";
import Nav from "./Navigation/Nav";
import Recommended from "./Recommended/Recommended";
import Sidebar from "./Sidebar/Sidebar";

const MainLayout = ({
    query,
    handleChange,
    handleInputChange,
    handleClick
}) => {
    return (
        <>
            <Sidebar handleChange={handleChange} />
            <Nav query={query} handleInputChange={handleInputChange} />
            <Recommended handleClick={handleClick} />
            <Outlet />
        </>
    );
};

export default MainLayout
