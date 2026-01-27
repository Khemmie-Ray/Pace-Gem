import React from 'react'
import Image from 'next/image'
import logoImg from '../../public/logo.png'
import Link from 'next/link'

const Header = () => {
  return (
    <header className='flex justify-between items-center w-[90%] mx-auto py-3 px-6 shadow-lg rounded-full backdrop-blur-2xl my-6 bg-white/10'>
      <Link href='/'>
        <Image 
        src={logoImg}
        alt='Pace logo'
        width={100}
        height={100}
        className='w-17.5 lg:w-25 md:w-16'
        />
        </Link>
        <nav>
          <Link href='/get-started' className='bg-linear-to-br from-[#5F5DFC] to-[#B840F9] rounded-lg py-3 lg:px-8 md:px-6 px-4'>Get Started</Link>
        </nav>
    </header>
  )
}

export default Header