import Head from 'next/head'
import Image from 'next/image'

export default function LitLogo() {

  return (
    <div className="flex">
        <div className='relative w-12 h-24'>
            <Image src="https://litprotocol.com/lit-logo.png" layout='fill' objectFit='contain' alt="Lit-Gather Space" />
        </div>
        <div className='flex justify-center pl-4'>
            <h1 className="text-3xl text-white m-auto">
            Lit-Gather Space
            </h1>
        </div>
    </div>
  )
}
