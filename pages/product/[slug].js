import Layout from '../../components/Layout'
import {useRouter} from 'next/router'
import React, { useContext } from 'react'
import data from '../../utils/data'
import Link from 'next/link';
import Image from "next/image";
import store from '../../utils/store'
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios'


export default function ProductScreen(props){

    const { state, dispatch } = useContext(store);
    const {product} = props;

    const router = useRouter()
    
    //const product = product.find(x => x.slug === slug);

    const addToCardHandler = async () =>{
        const existItem = state.cart.cartItems.find((x) => x.slug === product.slug)
        let quantity = existItem ? existItem.quantity + 1 : 1
        const {data} = await axios.get(`/api/product/${product._id}`)

        if(data.countInStock < quantity){
            quantity = product.countInStock
            return toast.error('product in out of stock')

        }

        dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        router.push('/cart')
    }

    if(!product){
        return <Layout title="non found"> product not foud</Layout>
    }


    return(
        <Layout title={product.name}>
            <div className='py-2'>
                <Link href="/">back home</Link>
            </div>

            <div className='grid md:grid-cols-4 md:gap-3'>
                 <div className='md:col-span-2'>
                    <Image
                    src={product.image}
                    alt={product.name}
                    height={640}
                    width={640}
                    Layout="responsive"/>
                 </div>
                 <div>
                    <ul>
                        <li>
                            <h1 className='text-lg'> {product.name}</h1>
                        </li>
                        <li> category:{product.category}</li>
                        <li> brand: {product.brand}</li>
                        <li> {product.rating}  of {product.numReviews} reviews</li>
                        <li> {product.description} </li>
                    </ul>
                 </div>
                 <div className='card p-5'>
                    <div className='mb-2 flex justify-between'>
                        <span> Price</span>
                        <div> ${product.price}</div>
                    </div>
                    <div className='mb-2 flex justify-between'>
                    <span> Status</span>
                    <div> {product.countInStock >0? 'IN stock' : 'non disponibile' }</div>


                 </div>
                 <div> 
                    <button className='primary-button w-full' onClick={addToCardHandler}> add to cart</button>
                 </div>
                 </div>
                
            </div>
        </Layout>

    )
}

export async function getServerSideProps(context){
    const {params} = context;
    const {slug} = params;

    await db.connect();
    const product = await Product.findOne({slug}).lean();

    db.disconnect()

    return{
        props: {
           product: product ? db.convertDoctoObj(product) : null }
    }
}