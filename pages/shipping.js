import React, { useContext, useEffect } from 'react'
import Layout from '../components/Layout'
import CheckoutWizard from '../components/CheckoutWizard'
import { useForm } from 'react-hook-form'
import Store from '../utils/store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function shipping() {
    const router = useRouter()
    const {handleSubmit,
        register,
        formState:{errors},
        setValue,
        getValues
    } = useForm();

    const {state, dispatch} = useContext(Store)
    const {cart} = state;
    const {shippingAddress}  = cart

    useEffect(() =>{
        setValue('fullName', shippingAddress.fullName);
        setValue('address', shippingAddress.address);
        setValue('city', shippingAddress.city);
        setValue('postalCode', shippingAddress.postalCode);
        setValue('country', shippingAddress.country);

    }, [setValue, shippingAddress])

    const submitHandler = ({fullName, address, city, postalCode, country}) =>{
        //const location = country

        dispatch({
            type:"SAVE_SHIPPING_ADDRESS",
            payload:{fullName, address, city, postalCode, country},
            

        });

        Cookies.set(
            'cart',
            JSON.stringify({
                ...cart,
                shippingAddress:{
                    fullName,
                    address,
                    city,
                    postalCode,
                    country}
            })
        );
        router.push('/payment')

    }
  return (
    <Layout title="shipping">
        <CheckoutWizard activeStep={1} />
        <form 
        className='mx-auto max-w-screen-md' onSubmit={handleSubmit(submitHandler)}>
            <h1 className='mb-4 text-xl'>Shipping Address</h1> 
            <div className='mb-4'>
                <label htmlFor='fullName'> Full name</label>
                <input
                className='w-full'
                id='fullName'
                autoFocus
                {...register('fullName',{
                    required:"please insert name"
                })} />
                {errors.fullName && (
                    <div className='text-red-500'> {errors.fullName.message} </div>
                )}
            </div>
            <div className='mb-4'>
                <label htmlFor='address'> address</label>
                <input
                className='w-full'
                id='address'
                autoFocus
                {...register('address',{
                    required:"please insert name",
                    minLength:{value:3, message:'inserisci lindirizzo'}
                })} />
                {errors.address && (
                    <div className='text-red-500'> {errors.address.message} </div>
                )}
            </div>
            <div className='mb-4'>
                <label htmlFor='city'> city</label>
                <input
                className='w-full'
                id='city'
                autoFocus
                {...register('city',{
                    required:"please insert name"
                })} />
                {errors.city && (
                    <div className='text-red-500'> {errors.city.message} </div>
                )}
            </div>
            <div className='mb-4'>
                <label htmlFor='postalCode'> Posta code</label>
                <input
                className='w-full'
                id='postalCode'
                autoFocus
                {...register('postalCode',{
                    required:"please insert name"
                })} />
                {errors.postalCode && (
                    <div className='text-red-500'> {errors.postalCode.message} </div>
                )}

<div className='mb-4'>
                <label htmlFor='country'> country</label>
                <input
                className='w-full'
                id='country'
                autoFocus
                {...register('country',{
                    required:"please insert name"
                })} />
                {errors.country && (
                    <div className='text-red-500'> {errors.country.message} </div>
                )}
            </div>
            </div>

            <div className='mb-4 flex justify-between'>
                <button className='primary-button'>Next</button>
            </div>

        </form>
    </Layout>
  )
}

shipping.auth = true;
