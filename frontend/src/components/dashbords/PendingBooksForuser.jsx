import axios from 'axios'
import React, { useEffect, useState } from 'react'

const PendingBooksForuser = () => {

    const [pendingIssue, setPendingIssue] = useState([])


    useEffect(() => {
        const getPendingIssue = async () => {
            let id = localStorage.getItem("userId")
            try {
                let { data } = await axios.get(`https://e-library-manager.vercel.app/pendingforuser/${id}`)
                setPendingIssue(data)

            } catch (error) {
                console.log("got err in pending", error)
            }
        }
        getPendingIssue()
    }, [pendingIssue])

    const returnIssueStatus = (status) => {
        if (status == "issued") {
            return "issued"
        } else if (status == "rejected") {
            return "rejected"
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
                <thead>

                    <tr>
                        <th style={{ border: "1px solid black " }}>Book Name</th>
                        <th style={{ border: "1px solid black " }}>Library Name</th>
                        <th style={{ border: "1px solid black " }}>Email</th>
                        <th style={{ border: "1px solid black " }}>Contact</th>
                        <th style={{ border: "1px solid black " }}>Address</th>
                        <th style={{ border: "1px solid black " }}>Status</th>
                    </tr>
                </thead>
                <tbody>

                    {pendingIssue.length == 0 ? <tr><td>No Book in pending</td></tr> : pendingIssue.map((el) => (

                        <tr  >
                            <td style={{ border: "1px solid black " }}>{el.title} </td>
                            <td style={{ border: "1px solid black " }}>{el.admin_name}</td>
                            <td style={{ border: "1px solid black " }}>{el.admin_email}</td>
                            <td style={{ border: "1px solid black " }}>{el.admin_contact}</td>
                            <td style={{ border: "1px solid black " }}>{el.admin_address}</td>
                            <td className={returnIssueStatus(el.status)} style={{ border: "1px solid black " }}>{el.status}</td>

                        </tr>

                    ))}
                </tbody>

            </table>
        </div>
    )
}

export default PendingBooksForuser
