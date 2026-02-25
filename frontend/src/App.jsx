import axios from 'axios'
import { useEffect, useState } from 'react'
import Card from './components/Card'

import Routes from './Routes'
import { useNavigate } from 'react-router-dom'

const App = () => {
    const [product, setProduct] = useState([])

    const navigate = useNavigate()
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const { data } = await axios.get("https://e-library-manager.vercel.app/allbooks")
                setProduct(data)
            } catch (error) {
                console.error("error during fetching repos", error)
            }
        }
        fetchBook()
    }, [product])

    const [selectedCategory, setSelectedCategory] = useState(null)
    const [query, setQuery] = useState("")

    const handleInputChange = event => {
        setQuery(event.target.value)
    }

    const filteredItems = product.filter(product => product.title.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) !== -1)

    const handleChange = event => {
        if (window.location.pathname != "/") {
            navigate("/")
        }
        setSelectedCategory(event.target.value)
    }

    const handleClick = event => {
        if (window.location.pathname != "/") {
            navigate("/")
        }

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
            <Routes result={result} query={query}
                handleChange={handleChange}
                handleInputChange={handleInputChange}
                handleClick={handleClick}
            />
        </>

    )
}

export default App
