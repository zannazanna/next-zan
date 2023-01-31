import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'
import { useForm } from "react-hook-form";
import { toDisplayString } from 'vue';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/router';
import {signIn, useSession} from 'next-auth/react'
import axios from 'axios';


export default function Register() {

  const {data:session} = useSession()
  const router = useRouter();
  const {redirect} = router.query;

  useEffect(() =>{
    if(session?.user){
      router.push(redirect || '/');
    }
  }, [router, session, redirect])

    const {handleSubmit, getValues,
      register,
      formState: { errors },} = useForm();
    const submitHandler = async ({name, email, password}) =>{
      try{

        await axios.post('/api/auth/signup', {
            name,
            email,
            password
        })



        const result = await signIn('credentials', {
          redirect:false,
          email,
          password,
        })
        console.log(email, password)
        if(result.error){
          toast.error(result.error)
        }
      }catch(err){

       toast.error(getError(err))
      }

    }
  return (
  <Layout title="register">
    <form className='mx-auto max-w-screen-md' onClick={handleSubmit(submitHandler)}>
        <h1 className='mb-4 text-xl'> Register</h1>
        <div className='mb-4'>
            <label htmlFor="name">Name</label> 
            <input
            {...register('name', {required:'please enter name', pattern: {
                
                message: 'Please enter valid name',
              },})}
            type="text" className="w-full" id='name' autoFocus/>
            {errors.name && (<div className='text-red-500'> {errors.name.message} </div>)}

        </div>
        <div className='mb-4'>
            <label htmlFor="email">email</label> 
            <input
            {...register('email', {required:'please enter email', pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
              },})}
            type="email" className="w-full" id='email' autoFocus/>
            {errors.email && (<div className='text-red-500'> {errors.email.message} </div>)}

        </div>
        <div className='mb-4'>
            <label htmlFor="password">password</label> 
            <input {...register('password', {required:"please enter password", minLength: {value:3, message:"password is more 5 characters"}})} type="password" className="w-full" id='password' autoFocus/>
{errors.password && (<div className="text-red-500"> {errors.password.message} </div>)}
        </div>
        <div className='mb-4'>
            <label htmlFor='confirmPassword'> Confirm password</label>
            <input 
            className='w-full'
            type="password"
            id="confirmPassword" 
            {...register('confirmPassword', { 
                validate: (value) => value === getValues('password'), minLength:{
                    value:3, message:"password is more 5 characters"
                }
            })}/>
{errors.confirmPassword && errors.confirmPassword.type === 'validate' && (<div className="text-red-500"> le 2 password non corrispondono </div>)}

        </div>
        <div className='mb-4'>
            <button className='primary-button'> register</button>
        </div>
        



    </form>


  </Layout>
  )
}
