
import Layout from '../components/Layout'
import data from '../utils/data'
import ProductItem from '../components/ProductItem'
import Product from '../models/Product'
import db from '../utils/db'
import axios from 'axios'
import { useContext } from 'react'
import Store from '../utils/store'
import { toast } from 'react-toastify'



export default function Home({products}) {
  const {state, dispatch} = useContext(Store)
  const {cart} = state;
  const addToCardHandler = async (product) =>{
    const existItem = cart.cartItems.find((x) => x.slug === product.slug)
    let quantity = existItem ? existItem.quantity + 1 : 1
    const {data} = await axios.get(`/api/product/${product._id}`)


    if(data.countInStock < quantity){
      toast.error("product is out of stock")
      quantity = product.countInStock
        return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success("product added in cart")
}
  return (
    <>
          <Layout title='home'>
            <div className='grid grid-cols-1  gap-4 md:grid-cols-3 lg:grid-cols-4'> 
            {products.map((product) => (
              <ProductItem product={product} key={product.slug} addToCardHandler={addToCardHandler}></ProductItem>

            ))} </div>
          </Layout>

    </>
  )
}

export async function getServerSideProps(){
  await db.connect();
  const products = await Product.find().lean();
  return {
    props:{
      products:products.map(db.convertDoctoObj)
    }
  }
}