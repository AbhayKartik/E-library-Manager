import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar/Sidebar'
import Nav from './Navigation/Nav'
import Recommended from './Recommended/Recommended'
import Card from './components/Card'

import Routes from './Routes'

const App = () => {
    const [product, setProduct] = useState([])

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const { data } = await axios.get("http://localhost:3000/allbooks")
                setProduct(data)
            } catch (error) {
                console.error("error during fetching repos", error)
            }
        }
        fetchBook()

    }, [])

    const [selectedCategory, setSelectedCategory] = useState(null)
    const [query, setQuery] = useState("")

    const handleInputChange = event => {
        setQuery(event.target.value)
    }

    const filteredItems = product.filter(product => product.title.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) !== -1)

    const handleChange = event => {
        setSelectedCategory(event.target.value)
    }

    const handleClick = event => {
        setSelectedCategory(event.target.value)
    }



    function filteredData(product, selected, query) {
        let filteredProduct = product

        if (query) {
            filteredProduct = filteredItems
        }

        if (selected) {
            filteredProduct = filteredProduct.filter(
                ({ category, author, title }) =>
                    category === selected ||
                    author === selected ||
                    title === selected)
        }
        return filteredProduct.map(({ id, imgurl, author, title, availableqty, description, imgname, category, addby }) => (
            <Card key={id}
                id={id}
                img={imgurl}
                title={title}
                author={author}
                availableqty={availableqty}
                description={description}
                imgname={imgname}
                category={category}
                addby={addby}
            />
        ))
    }

    const result = filteredData(product, selectedCategory, query,)
    return (
        <>
            {/* <Sidebar handleChange={handleChange} />
            <Nav query={query} handleInputChange={handleInputChange} />
            <Recommended handleClick={handleClick} />
            <Products result={result} /> */}
            <Routes result={result} query={query}
                handleChange={handleChange}
                handleInputChange={handleInputChange}
                handleClick={handleClick}
            />
        </>

    )
}

export default App
