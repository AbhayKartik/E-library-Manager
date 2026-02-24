import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const ReturnedUserBooks = () => {
    const [returnedBooks, setreturnedBooks] = useState([])
    useEffect(() => {
        const id = localStorage.getItem("userId")

        const getAllIssuedBooks = async () => {
            let { data } = await axios.get(`http://localhost:3000/return/${id}`)
            setreturnedBooks(data)
        }
        getAllIssuedBooks()

    }, [])
    return (
        <div className="card-container">
            <h3 style={{ marginLeft: "40%" }}>Issued Book </h3>

            <table border="1" cellPadding="8" cellSpacing="0" style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid black"
            }} >
                <thead>

                    <tr >
                        <th style={{ border: "1px solid black " }}>Book Name </th>
                        <th style={{ border: "1px solid black" }}>Member Name</th>
                        <th style={{ border: "1px solid black" }}>Member Contact</th>
                        <th style={{ border: "1px solid black" }}>Issues Date</th>
                        <th style={{ border: "1px solid black" }}>Due Date</th>
                        <th style={{ border: "1px solid black" }}>Return Date</th>
                        <th style={{ border: "1px solid black" }}>Fine</th>
                    </tr>
                </thead>
                <tbody>

                    {issuedBook.length == 0 ? <tr><td>No Book In Issue</td></tr> : issuedBook.map((el) => (
                        <tr key={el.Issued_Id} >
                            <td style={{ border: "1px solid black" }}>{el.title} </td>
                            <td style={{ border: "1px solid black" }}>{el.username} </td>
                            <td style={{ border: "1px solid black" }}>{el.contact} </td>
                            <td style={{ border: "1px solid black" }}>{new Date(el.IssueDate).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })} </td>
                            <td style={{ border: "1px solid black" }}>{new Date(el.DueDate).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })} </td>
                            <td style={{ border: "1px solid black" }}>{el.ReturnDate ? new Date(el.ReturnDate).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            }) : "Book Pending"} </td>
                            <td style={{ border: "1px solid black" }}>{el.Fine} </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    )
}

export default ReturnedUserBooks
