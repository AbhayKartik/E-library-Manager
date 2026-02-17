import React, { useEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'
import { useAuth } from './Authcontext'
import Library from './components/dashbords/dashboard/Library'
import Signup from './auth/signjup/Signup'
import Login from './auth/login/Login'
import IssuedBooks from "./components/dashbords/IssuedBooks"
import PendingIssue from './components/dashbords/PendingIssue'
import PendingBooksForuser from './components/dashbords/PendingBooksForuser'
import IssueBookUser from './components/dashbords/IssueBookUser'
import AuthLayout from './AuthLayout'
import App from './App'
import MainLayout from './MainLayout'
import HandleUser from './components/dashbords/HandleUser'
const Routes = ({ result, query,
    handleChange,
    handleInputChange,
    handleClick }) => {
    const { currentUser, setCurrentUser } = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        const userIdFromStorage = localStorage.getItem("userId")
        if (userIdFromStorage && !currentUser) {
            setCurrentUser(userIdFromStorage)
        }

        if (!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname)) {
            navigate("/auth")
        }

        if (userIdFromStorage && window.location.pathname == "/auth") {
            navigate("/")
        }
    }, [currentUser, navigate, setCurrentUser])


    let element = useRoutes([

        {
            element: <AuthLayout />,
            children: [
                {
                    path: "/auth",
                    element: <Login />
                },
                {
                    path: "/signup",
                    element: <Signup />
                },
            ]
        },
        {
            element: (
                <MainLayout query={query}
                    handleChange={handleChange}
                    handleInputChange={handleInputChange}
                    handleClick={handleClick} />
            ),
            children: [
                {
                    path: "/",
                    element: <Library result={result} />
                },
                {
                    path: "/issuedBook",
                    element: <IssuedBooks />
                },

                {
                    path: "/pendingIssue",
                    element: <PendingIssue />
                },
                {
                    path: "/Pendinguserbook",
                    element: <PendingBooksForuser />
                },
                {
                    path: "/issuedUserBook",
                    element: <IssueBookUser />

                },
                {
                    path: "/handleUser",
                    element: <HandleUser />
                }
            ]
        },

    ])
    return element
}

export default Routes