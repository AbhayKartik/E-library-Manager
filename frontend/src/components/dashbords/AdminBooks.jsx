import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const AdminBooks = () => {
    const [adminName, setAdminName] = useState("")
    const [libraryBooks, setLibraryBooks] = useState([])
    let { id } = useParams();

    useEffect(() => {
        const GetAdminData = async () => {
            let { data } = await axios.get(`http://localhost:3000/AdminAllBook/${id}`)
            setLibraryBooks(data)

            setAdminName(data[0].admin_username)
        }
        GetAdminData()
    }, [id])
    return (
        <div className="card-container">
            <h3 style={{ marginLeft: "40%" }}>{adminName}</h3>

            <table border="1" cellPadding="8" cellSpacing="0" style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid black"
            }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid black " }}>Title</th>
                        <th style={{ border: "1px solid black " }}>Author</th>
                        <th style={{ border: "1px solid black " }}>Category</th>
                        <th style={{ border: "1px solid black " }}>Available Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {libraryBooks.map((el) => (
                        <tr key={el.id}>

                            <td>{el.title} </td>
                            <td>{el.author}</td>
                            <td>{el.category} </td>
                            <td>{el.availableqty} </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}

export default AdminBooks
