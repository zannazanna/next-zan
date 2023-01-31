import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { type } from 'os';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'
import Store from '../utils/store';

export default function payment() {

    const [selectPayment, setSelectPayment] = useState("");
    const router = useRouter();
    const {state, dispatch} = useContext(Store);
    const {cart} = state;
    const {shippingAddress, paymentMethod} = cart

    // const selectPaymentMethod = (payment) =>{
    //     setSelectPayment(payment)
    //     console.log(selectPayment)
    // }

    const submitHandler = (e) =>{
        e.preventDefault();
        if(!selectPayment){
           return toast.error('Payment methods is required')
        }

          dispatch({type:"SAVE_PAYMENT_METHOD", payload:selectPayment});
          Cookies.set(
            'cart', JSON.stringify({...cart, paymentMethod: selectPayment})
          )
          router.push('/placeholder')
    }
    useEffect(() =>{
        if(!shippingAddress.address){
           return router.push('/shipping')
        };
        setSelectPayment(paymentMethod | '')

    }, [paymentMethod, router, shippingAddress.address])


  return (
   <Layout title="payment">
    <CheckoutWizard activeStep={2} />
    <form className='mx-auto max-w-screen-md' onSubmit={submitHandler}> 
    <h1 className='mb-4 text-xl'> Payment </h1>
    {
    ['Paypal', 'Stripe', 'CashOnDelivery'].map((payment) =>(
        <div className='mb-4' key={payment}>
            
            <input  name='paymentMethod'
            className='p-2 online-none focus:ring-0'
            id={payment}
            type="radio"
            checked={selectPayment == payment}
            onChange={() => setSelectPayment(payment)} />

            <label htmlFor={payment}> {payment}</label>
             </div>
    ))
    }
    <div className='mb-4 flex justify-between'>
        <button onClick={() => router.push('/shipping')} className="default-button"> Back</button>
        <button className='primary-button' > Next</button>

    
    </div> 

    </form>

  
 </Layout>  )
}


payment.auth= true