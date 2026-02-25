import axios, { Axios } from 'axios'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

const IssueBookUser = () => {

    const [issue, setIssue] = useState([])
    const handleError = (err) =>
        toast.error(err, {
            position: "bottom-left",
        });
    const handleSuccess = (msg) =>
        toast.success(msg, {
            position: "bottom-right",
        });

    useEffect(() => {
        const getIssue = async () => {
            let id = localStorage.getItem("userId")
            try {
                let { data } = await axios.get(`https://e-library-manager.vercel.app/record/${id}`)
                setIssue(data)

            } catch (error) {
                console.log("got err in pending", error)
            }
        }
        getIssue()
    }, [issue])

    const returnBook = async (bookid, title, email, username) => {
        try {
            let id = localStorage.getItem("userId")

            let { data } = await axios.post(`https://e-library-manager.vercel.app/return/${id}`, { bookid, title, email, username })

            let { success, message } = data
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
    }
    return (
        <div className="card-container">
            <h3 style={{ marginLeft: "40%" }}>Issued Book </h3>
            <table border="1" cellPadding="8" cellSpacing="0" style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid black"
            }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid black " }}>Book Name</th>
                        <th style={{ border: "1px solid black " }}>Library Name</th>
                        <th style={{ border: "1px solid black " }}>Email</th>
                        <th style={{ border: "1px solid black " }}>Issued</th>
                        <th style={{ border: "1px solid black " }}>Due Date</th>
                        <th style={{ border: "1px solid black " }}>Return Dated</th>
                        <th style={{ border: "1px solid black " }}>Fine</th>
                    </tr>
                </thead>
                <tbody>

                    {issue.length > 0 ? issue.map((el) => (

                        <tr   >
                            <td style={{ border: "1px solid black " }}>{el.title} </td>
                            <td style={{ border: "1px solid black " }}>{el.username}</td>
                            <td style={{ border: "1px solid black " }}>{el.email}</td>
                            <td style={{ border: "1px solid black " }}>{new Date(el.IssueDate).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}</td>
                            <td style={{ border: "1px solid black " }}>{new Date(el.DueDate).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}</td>
                            <td style={{ border: "1px solid black " }}>{el.ReturnDate ? new Date(el.ReturnDate).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            }) : <button onClick={() => returnBook(el.id, el.title, el.email, el.username)} className='btn btn-success'>Return</button>}</td>
                            <td style={{ border: "1px solid black " }}>{el.Fine}</td>

                        </tr>
                    )) : <tr>

                        <td>No book issued</td>
                    </tr>
                    }
                </tbody>

            </table>
            <ToastContainer />

        </div >
    )
}

export default IssueBookUser
