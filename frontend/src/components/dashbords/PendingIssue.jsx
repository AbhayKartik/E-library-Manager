import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

const PendingIssue = () => {


    const [pendingIssue, setPendingIssue] = useState([])


    useEffect(() => {
        const getPendingIssue = async () => {
            let id = localStorage.getItem("userId")
            try {
                let { data } = await axios.get(`http://localhost:3000/pending/${id}`)
                setPendingIssue(data)

            } catch (error) {
                console.log("got err in pending", error)
            }
        }
        getPendingIssue()
    }, [pendingIssue])
    const handleError = (err) =>
        toast.error(err, {
            position: "bottom-left",
        });
    const handleSuccess = (msg) =>
        toast.success(msg, {
            position: "bottom-right",
        });
    const issueBook = async (memberid, bookid) => {
        try {
            let { data } = await axios.post(`http://localhost:3000/record/${bookid}`, { MemberID: memberid, isIssue: true })
            let { success, message } = data
            if (success) {
                handleSuccess(message)
            } else {
                handleError(message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const rejectBook = async (memberid, bookid) => {
        try {
            let { data } = await axios.post(`http://localhost:3000/record/${bookid}`, { MemberID: memberid, isIssue: false })
            let { message } = data

            handleError(message)

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="card-container">
            <h3 style={{ marginLeft: "40%" }}>Pending Book </h3>

            <table border="1" cellPadding="8" cellSpacing="0" style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid black"
            }}>
                <tr>
                    <th style={{ border: "1px solid black " }}>Member Name</th>
                    <th style={{ border: "1px solid black " }}>Email</th>
                    <th style={{ border: "1px solid black " }}>Contact</th>
                    <th style={{ border: "1px solid black " }}>Book Name</th>
                    <th style={{ border: "1px solid black " }}>Status</th>
                </tr>
                {pendingIssue.length == 0 ? <h6>No Book in pending</h6> : pendingIssue.map((el) => (
                    <tr >
                        <td style={{ border: "1px solid black " }}>{el.username} </td>
                        <td style={{ border: "1px solid black " }}>{el.email}</td>
                        <td style={{ border: "1px solid black " }}>{el.contact}</td>
                        <td style={{ border: "1px solid black " }}>{el.title}</td>
                        {el.status == "pending" ?
                            <td style={{ border: "1px solid black ", display: "flex", gap: "20px" }}>

                                <button className='btn btn-success' onClick={() => { issueBook(el.MemberID, el.BookID) }}>Issue</button>
                                <button className='btn btn-danger' onClick={() => { rejectBook(el.MemberID, el.BookID) }}>Decline</button>
                            </td>
                            : <td style={{ border: "1px solid black " }}>{el.status}</td>}
                    </tr>
                ))}
            </table>
            <ToastContainer />
        </div>
    )
}

export default PendingIssue
