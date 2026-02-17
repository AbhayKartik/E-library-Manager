import axios from 'axios'
import React, { useEffect, useState } from 'react'

const HandleUser = () => {
    const [allusers, setAllUsers] = useState([])
    useEffect(() => {
        const getAllusers = async () => {
            try {

                let { data } = await axios.get("http://localhost:3000/allusers")
                setAllUsers(data)
            } catch (error) {
                console.log(error)
            }
        }
        getAllusers()
    }, [])
    return (
        <div className="card-container">
            <h3 style={{ marginLeft: "40%" }}>All Users </h3>
            <table border="1" cellPadding="8" cellSpacing="0" style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid black"
            }} >
                <thead>
                    <tr>
                        <th style={{ border: "1px solid black " }}>Username</th>
                        <th style={{ border: "1px solid black " }}>Email</th>
                        <th style={{ border: "1px solid black " }}>Contact</th>
                        <th style={{ border: "1px solid black " }}>Issued Book</th>
                        <th style={{ border: "1px solid black " }}>Returned Book</th>
                        <th style={{ border: "1px solid black " }}>Pending Book</th>
                        <th style={{ border: "1px solid black " }}>Rejected Book</th>
                        <th style={{ border: "1px solid black " }}>Total Fine</th>
                    </tr>
                </thead>
                <tbody>

                    {allusers.map((el) => (
                        <tr key={el.user_id}>
                            <td style={{ border: "1px solid black " }}>{el.username} </td>
                            <td style={{ border: "1px solid black " }}>{el.email} </td>
                            <td style={{ border: "1px solid black " }}>{el.contact} </td>
                            <td style={{ border: "1px solid black " }}>{el.issued_count} </td>
                            <td style={{ border: "1px solid black " }}>{el.returned_count} </td>
                            <td style={{ border: "1px solid black " }}>{el.pending_count} </td>
                            <td style={{ border: "1px solid black " }}>{el.rejected_count} </td>
                            <td style={{ border: "1px solid black " }}>{el.total_fine} </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default HandleUser
