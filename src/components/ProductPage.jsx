import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import Spinner from './Spinner';



const Item = ({ children, reference }) => {
    return (
        <div ref={reference}>
            {children}
        </div>
    );
};


const ProductPage = () => {

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [productLimit, setProductLimit] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0)
    const observer = useRef();
  
    useEffect(() => {
      getItems(productLimit);
    }, []);


    const lastItemRef = useCallback(
        (node) => {
            // if loading (request is already made) return from here
            if (isLoading) return;

            // if observer is available then remove observer
            if (observer.current) observer.current.disconnect();
        
            // Get the new data and assign it to the observer.current
            observer.current = new IntersectionObserver((entries) => {
                // if intersected current last product and has more products then fetch new data
                if (entries[0].isIntersecting && productLimit) {
                    if(items.length < totalProducts){
                        getItems(productLimit);
                        setProductLimit(productLimit + 5);   
                    
                    }else {
                        setProductLimit(0);
                    }   
                }
            });
        
            // if node then assign observer to last item 
            if (node) observer.current.observe(node);
        },
        [isLoading, productLimit]
    );


    // Fetch data from api
  
    const getItems = async (limit) => {
      setIsLoading(true);

      // for immitating new data loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      
      await axios
        .get(
          `https://dummyjson.com/products?limit=${limit === 10 ? 10 : 5}&skip=${
            limit === 10 ? 0 : limit + 5
          }`,
        )
        .then((resp) => {
          setItems([...items, ...resp.data.products]);
          setTotalProducts(resp.data.total)
          setIsLoading(false);
        });
    };
  

  return (
    <>

        <div>
            <h1>Product Page</h1>
        </div>
    
        <div className='product-page'> 
            {
                items.map((product, index) =>
                index + 1 === items.length ? 
                (<Item reference={lastItemRef} key={index}> 
                    <ProductCard key={index} product={product} />
                </Item>) : 
                (<Item key={index}>
                    <ProductCard product={product} />
                </Item>))
            }
        </div>

        <div>{isLoading && <Spinner />}</div>
  
    </>
  )
}

export default ProductPage