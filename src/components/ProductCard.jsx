import React from 'react';

const ProductCard = ({product}) => {

  return (
    <div className='product-card'>
        <img src={product.thumbnail} alt="product_thumbnail" className='product-img' />
        <h2>{product.title}</h2>
    </div>
  )
}

export default ProductCard