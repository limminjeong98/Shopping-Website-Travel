import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider'
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
import { continents, price } from './Sections/Datas';

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })
    const [SearchTerm, setSearchTerm] = useState("")


    useEffect(() => {

        let body = {
            skip: Skip,
            limit: Limit
        }
        getProducts(body)
    }, [])

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
            .then(response => {
                if(response.data.success){

                    // console.log(response.data)
                    if(body.loadMore){
                        setProducts([...Products, ...response.data.productInfo])
                    }else{
                    setProducts(response.data.productInfo.slice(0, 8))
                    }
                    setPostSize(response.data.postSize)
                }else{
                    alert("상품들을 가져오는데 실패했습니다.")
                }
            })
    }

    const loadMoreHandler= () => {

        let skip = Skip + Limit
        // 처음 더보기를 눌렀을때는 0이지만 계속 누르면 추가됨
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true,
            filters: Filters
        }
        getProducts(body)
        setSkip(skip)
        // 다음에 사용할 skip을 저장
        
    }

    const renderCards = Products.map((product, index) => {

        return <Col lg={6} md={8} xs={24} key={index}>
            <Card
                cover={<a href={`/product/${product._id}`}><ImageSlider images={product.images} /></a>}
            >
                <Meta 
                    title={product.title}
                    description={`$${product.price}`}/>
            </Card>
        </Col>
    })

    const showFilteredResult = (filters) => {

        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }

        getProducts(body)
        setSkip(0)
    }

    const handlePrice = (value) => {

        const data = price;
        let array = [];

        for (let key in data){
            if(data[key]._id === parseInt(value, 10)){
                array = data[key].array
            }
        }
        console.log('array',array)
        return array;
    }

    const handleFilters = (filters, category) => {

        const newFilters = {...Filters}

        newFilters[category] = filters
        // category는 continents나 price
        console.log('filters', filters)

        if(category === "price"){
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }

        
        showFilteredResult(newFilters)
        setFilters(newFilters)

    }

    const updateSearchTerm = (newSearchTerm) => {
    

        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>

            <div style={{ textAlign: 'center' }}>
                <h2>Let's Travel Anywhere <Icon type="rocket" /></h2>

            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto'}}>
                <SearchFeature
                    refreshFunction={updateSearchTerm}/>
            </div>
            {/* Filter */}
            <Row gutter={[16,16]}>
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
                    <CheckBox list={continents} handleFilters={filters => handleFilters(filters, "continents")}/>
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <RadioBox list={price} handleFilters={filters => handleFilters(filters, "price")}/>
                </Col>
            </Row>

            

            {/* Search */}

            {/* Cards */}
            <Row gutter={[16, 16]}>
                {renderCards}
            </Row>
            

            {/* {Products.map(product)}
            <Card
            
            >
                <Meta />
            </Card> */}

            <br />

            {PostSize >= Limit && 
                <div style={{ display: 'flex', justifyContent:'center' }}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }
        </div>
    )
}

export default LandingPage
