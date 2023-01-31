import Image from "next/image"
import Link from "next/link"
import { Router, useRouter } from "next/router"
import { useContext } from "react"
import Layout from "../components/Layout"
import Store from "../utils/store"
import dynamic from 'next/dynamic'
import axios from "axios"
import { toast } from "react-toastify"

function Cart() {
    const router = useRouter();
    const { state, dispatch } = useContext(Store)

    const {
        cart: { cartItems },
    } = state;

    const removeItem = (item) => {
        dispatch({ type: "CART_REMOVE_ITEM", payload: item })
    }

    const updateCart = async (item, e) =>{
        const quantity = Number(e);
        const {data} = await axios.get(`/api/product/${item._id}`)
        if(data.countInStock < quantity){
            return toast.error('product in out of stock')
        }
        dispatch({type:"CART_ADD_ITEM", payload:{...item, quantity}});
        toast.success('product updated in the cart')
    }
    return (
        <Layout title="Shopping card">
            <h1 className="mb-4 text-xl"> Shopping card </h1>
            {cartItems.length == 0 ? (<div> Cart is empy. <Link href="/">Go shopping</Link></div>) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <table className="min-w-full">
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
                                    <tr key={item.slug} className="border-b">
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

                                        <td className="p-5 text-right">
                                            <select value={item.quantity} onChange={(e) =>updateCart(item, e.target.value) }> 
                                          {[...Array(item.countInStock).keys()].map( x =>(
                                            <option key={x+1} value={x+1}> {x +1}</option>

                                          ))}
                                          </select>
                                        </td>
                                        <td className="p-5 text-right">
                                            {item.price}
                                        </td>
                                        <td className="p-5 text-center">

                                            <button onClick={() => { removeItem(item) }}>
                                                <span> X</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="card p-5">
                        <ul>
                            <li>
                                <div className="pb-3"> subtotal {cartItems.reduce((a, c) => a + c.quantity, 0)}
                                {''}
                                : $ {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                                </div> </li>
                                <li>
                                    <button onClick={() => router.push('login?redirect=/shipping')}className="primary-button w-full"> Check out</button> </li> </ul> </div>
                </div>)}

        </Layout>
    )
}

export default dynamic(() => Promise.resolve(Cart), {ssr:false})