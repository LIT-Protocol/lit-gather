import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export default function LitLogo() {

  return (
    <div className="flex justify-center">
        <div className='relative w-6 h-6 my-auto'>
            <Image src="https://litprotocol.com/lit-logo.png" layout='fill' objectFit='contain' alt="Lit-Gather Space" />
        </div>
        <div className='flex justify-center pl-2'>
            <h1 className="text-xl text-white m-auto">
            <Link href="/">
              Lit-Gather Space
            </Link>
            </h1>
        </div>
    </div>
  )
}