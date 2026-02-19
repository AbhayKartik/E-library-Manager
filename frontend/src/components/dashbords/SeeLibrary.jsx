import axios from 'axios'
import React, { useEffect, useState } from 'react'


const SeeLibrary = () => {
    const [allAdmin, setAllAdmin] = useState([])
    useEffect(() => {
        const getAllAdmin = async () => {
            try {

                let { data } = await axios.get("http://localhost:3000/allAdmin")
                setAllAdmin(data)
            } catch (error) {
                console.log(error)
            }
        }
        getAllAdmin()
    }, [])
    return (
        <div className="card-container">
            <h3 style={{ marginLeft: "40%" }}>All Users </h3>

            <table border="1" cellPadding="8" cellSpacing="0" style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid black"
            }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid black " }}>name</th>
                        <th style={{ border: "1px solid black " }}>email</th>
                        <th style={{ border: "1px solid black " }}>contact</th>
                        <th style={{ border: "1px solid black " }}>address</th>
                    </tr>
                </thead>
                <tbody>
                    {allAdmin.map((el) => (
                        <tr key={el.id}>
                            <td style={{ border: "1px solid black " }}>{el.username} </td>
                            <td style={{ border: "1px solid black " }}>{el.email} </td>
                            <td style={{ border: "1px solid black " }}>{el.contact}</td>
                            <td style={{ border: "1px solid black " }}>{el.address} </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}

export default SeeLibrary
