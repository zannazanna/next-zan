import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";
import Link from "next/link"
import Image from 'next/image'
import {PayPalButtons, usePayPalScriptReducer} from '@paypal/react-paypal-js'
import { toast } from "react-toastify";
function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' }

        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' }

        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        
        case "PAY_REQUEST":{
            return {...state, loadingPay:true}
        }
        case "PAY_SUCCESS":{
            return {...state, loadingPay:false, successPay:true}
        }
        case "PAY_FAIL":{
            return{...state, loadingPay:false, errorPay:action.payload}
        }
        case "PAY_RESET":{
            return{...state, loadingPay:false, successPay:false, errorPay:''}
        }
        default:
            state;
    }
}


function OrderScreen() {

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer()

    const router = useRouter();
    const {query} = router
    
    const  orderId  = query.id

    console.log(router.query)

    const [{
        loading, error, order, successPay, loadingPay, errorPay
    }, dispatch,]
        = useReducer(reducer, {
            loading: true,
            order: {},
            error: '',
        });

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" })
                const { data } = await axios.get(`/api/orders/${orderId}`)
                dispatch({ type: "FETCH_SUCCESS", payload: data })
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) })
            }

        }
        if (!order._id || successPay || (order._id && order._id !== orderId)) {
            fetchOrder();
            if(successPay){
                dispatch({type:"PAY_RESET"})
            }
        }else {
            const loadPaypalScript = async () =>{
                const {data:clientId} = await axios.get('/api/keys/paypal');
                paypalDispatch({
                    type:'resetOptions',
                    value:{
                        'client-id':clientId,
                        currency:'EUR   '
                    }
                });
                paypalDispatch({type:'setLoadingStatus', value:'pending'})
            }
            loadPaypalScript()
        }

    }, [order, orderId, paypalDispatch, successPay])

    const {
        shippingAddress,
        paymentMethod,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid,
        paidAt,
        isDelivered,
        deliveredAt,
    } = order;


   function createOrder(data, actions){
    return actions.order.create({
        purchase_units:[
            {
                amount:{value:totalPrice}
            }
        ]
    }).then((orderId)=>{
        return orderId;
    })

   }

   function onApprove(data, actions){
    return actions.order.capture().then(async function(details){
        try{
            dispatch({type:"PAY_REQUEST"})
            const {data} = await axios.put(
                `/api/orders/${order._id}/pay`, details
            );

        }catch(err){
            dispatch({type:"PAY_FAIL", payload:getError(err)})
            toast.error(getError(err))
        }
    })
}

   function onError(err){
    toast.error(getError(err))
   }

    return (
        <Layout title={`orser ${orderId}`}>
            <h1 className="mb-4 text-xl"> {`Order ${orderId}`}</h1>

            {loading ? (<div>...loading</div>) : error ? (<div className="alert-error"> {error}</div>) : (<div className="grid md:grid-cols-4 md:gap-5">

                <div className="overflow-x-auto md:col-span-3">
                    <div className="card p-5">
                        <h2 className="mb-2 text-lg"> Shipping address</h2>
                        <div>
                            {shippingAddress.fullName}, {shippingAddress.address}, {' '}, {shippingAddress.city}, {shippingAddress.postalCode}, {' '}, {shippingAddress.country}
                        </div>
                        <div>

                            {isDelivered ? (<div className="alert-succedd"> Delivered at {deliveredAt} </div>) : (<div className="alert-error"> not delivered</div>)}

                        </div>
                    </div>

                    <div className="card p-5">
                        <h2 className="mb-2 text-lg"> pyament method</h2>
                        <div> {paymentMethod} </div>
                        {isPaid ? (<div className="alert-success"> pay as {paidAt} </div>) : (<div className="alert-error"> Not paid</div>)}

                    </div>

                    <div className="card p-5">
                        <h2 className="mb-2 text-lg"> Order items</h2>
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
                            {orderItems.map((item) => (
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
                    </div>
                </div>
                <div>
                            <div className='card p-5'>
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
                                    {!isPaid && (
                                        <li> {isPending ? (<div>loading...</div>): (
                                            <div className="w-full">
                                                <PayPalButtons
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={onError}>
                                                </PayPalButtons>
                                            </div>
                                        )}</li>
                                    )}

                                    {loadingPay && <div>loading...</div>}
                                   
                                </ul>
                            </div> </div>

            </div>)}

        </Layout>
    )
}

OrderScreen.auth = true;
export default OrderScreen