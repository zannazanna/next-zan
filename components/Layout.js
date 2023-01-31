import Head from 'next/head'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react';
import store from '../utils/store'
import { ToastContainer } from 'react-toastify';
import { signIn, signOut, useSession } from 'next-auth/react'
import 'react-toastify/dist/ReactToastify.css'
import { Menu } from '@headlessui/react'
import DropdownLink from './DropdownLink';
import Cookies from 'js-cookie'

export default function layout({ title, children }) {
    const { state, dispatch } = useContext(store);
    const { cart } = state;
    const { status, data: session } = useSession()

    const [cartItemsCount, setCardItemsCount] = useState(0);
    useEffect(() => {
        setCardItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0)), [cart.cartItems]
    })

    const LogoutHandler =() =>{
        Cookies.remove("cart")
        dispatch({type:"CART_RESET"})
        signOut({redirect:'/login'})
    }



    return (
        <>
            <Head>
                <title>{title ? title + ' - Zanzona' : 'Zanzona'}</title>
                <meta name="description" content="Ecommerce Website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ToastContainer position='bottom-center' limit={1} />
            <div className='flex min-h-screen flex-col justify-between '>

                <header>
                    <nav className='flex h-12 justify-between shadow-md px-4 items-center'>
                        <Link href="/">
                            <span className='text-lg font-bold'>amazona</span>
                        </Link>

                        <div>
                            <Link href="/cart">
                                <span className='p-2'>cart {cartItemsCount > 0 && (<span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'> {cartItemsCount} </span>)}</span>
                            </Link>


                            {status === 'loading' ? ('loading') : session?.user ?
                                <Menu as="div" className="relative inline-block" >
                                    <Menu.Button className="text-blue-600">
                                        {session.user.name}

                                    </Menu.Button >


                                    <Menu.Items className="absolute right-0 w-56 origin-top-rigth shadow-lg  bg-white">
                                        <Menu.Item>
                                            <DropdownLink className="dropdown-link" href="/profile">
                                                Profile
                                            </DropdownLink>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <DropdownLink className="dropdown-link" href="/order-history">
                                                Order history
                                            </DropdownLink>
                                        </Menu.Item>
                                        <Menu.Item>
                                           <a href='#' className='dropdown-link' onClick={LogoutHandler}>Logout</a>
                                        </Menu.Item>
                                    </Menu.Items>

                                </Menu>
                                : (<Link href="/login"> <span className='p-2'>login</span>
                                </Link>)}

                        </div>
                    </nav>
                </header>

                <main className='container ml-0 m-auto mt-4 px-4'>
                    {children}
                </main>

                <footer className='flex justify-center items-center h-10 shadow-inner font-bold'>
                    Copyrigth 2023 ZANNA
                </footer>
            </div>

        </>
    )
}