import React, { useContext, useEffect, useState } from 'react'
import CheckoutWizard from '../components/CheckoutWizard'
import Link from "next/link"
import Store from '../utils/store'
import Layout from '../components/Layout'
import Image from 'next/image'
import { Router, useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { getError } from '../utils/error'
import axios from 'axios'
import Cookies from 'js-cookie'


export default function placeholder() {

    const { state, dispatch } = useContext(Store)
    const { cart } = state;
    const { shippingAddress, cartItems, paymentMethod } = cart;
    const router = useRouter()

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;


    const itemsPrice = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0))
    const taxPrice = round2(itemsPrice * 0.15)
    const shippingPrice = itemsPrice > 200 ? 0 : 15;
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
    

    useEffect(() => {
        if(!paymentMethod){
            router.push('/payment')
        }
    }, [paymentMethod, router])

    const [loading, setLoading] = useState(false);

    const placeOrderHandler = async () =>{
        try{
            setLoading(true);
            const {data} = await axios.post('/api/orders',{
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            });
            setLoading(false);
            dispatch({type:"CART_CLEAR_ITEMS"});
            Cookies.set('cart',
            JSON.stringify({
                ...cart,
                cartItems:[],
            }))

            router.push(`/order/${data._id}`)

        } catch(err){
            setLoading(false)
            toast.error(getError(err))
        }
    }





    return (
        <Layout title="place order">
            <CheckoutWizard activeStep={3} />
            <h1 className='mb-4 text-xl'> Place order</h1>
            {cartItems.length === 0 ? (<div> class is empty <Link href='/'> go to home </Link></div>) :
                (
                    <div className='grid md:grid-cols-4 md:gap-5'>
                        <div className='overflow-x-auto md:col-span-3'>
                            <div className='card p-5'>
                                <h2 className='mb-2 text-lg'> Shipping Address</h2>

                                {shippingAddress.fullName}, {shippingAddress.address}, {' '}, {shippingAddress.city}, {shippingAddress.postalCode}, {' '}, {shippingAddress.country}

                                <div>
                                    <Link href="/shipping"> Edit</Link>
                                </div>
                            </div>
                            <div className='card p-5'>
                                <h2 className='mb-2 text-lg'> Payment Method</h2>
                                <div>{paymentMethod}</div>
                                <div>
                                    <Link href="/payment"> Edit</Link>
                                </div>

                            </div>

                            <div className='card p-5'>
                                <h2 className='mb-2 text-lg'> Order</h2>
                                <table className='min-w-full'>
                                    <thead className="border-b">

                                        <tr>
                                            <th className="px-5 text-left">item </th>
                                            <th className="px-5 text-right">quantity </th>
                                            <th className="px-5 text-right">price </th>
                                            <th className="px-5 ">action </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={item._id} className="border-b">
                                                <td>
                                                    <Link href={`/product/${item.slug}`}>
                                                        <span className="flex items-center">
                                                            <Image
                                                                src={item.image}
                                                                alt={item.name}
                                                                height={50}
                                                                width={50} />
                                                            &nbsp;
                                                            {item.name}
                                                        </span>
                                                    </Link>

                                                </td>
                                                <td className="p-5 text-right"> {item.quantity} </td>
                                                <td className="p-5 text-right"> {item.price} </td>
                                                <td className="p-5 text-right"> ${item.quantity * item.price} </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div>
                                    <Link href={"/cart"}> edit</Link>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className='cart p-5'>
                                <ul>
                                    <li>
                                        <div className='mb-2 flex justify-between'>
                                            <div> Items</div>
                                            <div>${itemsPrice}</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className='mb-2 flex justify-between'>
                                            <div> Tax</div>
                                            <div>${taxPrice}</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className='mb-2 flex justify-between'>
                                            <div> Shipping</div>
                                            <div>${shippingPrice}</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className='mb-2 flex justify-between'>
                                            <div> Total</div>
                                            <div>${totalPrice}</div>
                                        </div>
                                    </li>
                                    <li>
                                        <button 
                                        disable={loading}
                                        onClick={placeOrderHandler}
                                        className="primary-button w-full">
                                            {loading ? 'loafing...' : 'Place order'}
                                        </button>
                                    </li>
                                </ul>
                            </div> </div>

                    </div>
                )}

        </Layout>
    )
}

placeholder.auth = true