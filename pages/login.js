import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'
import { useForm } from "react-hook-form";
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import {signIn, useSession} from 'next-auth/react'


export default function Login() {

  const {data:session} = useSession()
  const router = useRouter();
  const {redirect} = router.query;

  useEffect(() =>{
    if(session?.user){
      router.push(redirect || '/');
    }
  }, [router, session, redirect])

    const {handleSubmit,
      register,
      formState: { errors },} = useForm();
    const submitHandler = async ({email, password}) =>{
      try{
        const result = await signIn('credentials', {
          redirect:false,
          email,
          password
        })
        console.log(email, password)
        if(result.error){
          console.log('errore' ,email, password, result)
          toast.error(result.error)
        }
      }catch(err){

       toast.error(getError(err))
      }

    }
  return (
  <Layout title="login">
    <form className='mx-auto max-w-screen-md' onClick={handleSubmit(submitHandler)}>
        <h1 className='mb-4 text-xl'> Login</h1>
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
            <button className='primary-button'> login</button>
        </div>
        <div className='mb-4'>Non hai un acconut?  <Link href={`/register?redirect=${redirect || '/'}`}>registrati</Link></div>



    </form>


  </Layout>
  )
}
