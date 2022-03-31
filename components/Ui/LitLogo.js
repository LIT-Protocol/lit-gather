import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export default function LitLogo({subtitleColor}) {

  const _subtitleColor = subtitleColor || 'text-grey-text';

  return (
    <div className="flex justify-center">
        <div className='relative w-6 h-6 my-auto'>
            <Image src="https://litprotocol.com/lit-logo.png" layout='fill' objectFit='contain' alt="Lit-Gather Space" />
        </div>
        <div className='flex justify-center pl-2'>
            <h1 className="text-xl text-white m-auto">
            <Link href="/">
              <div className='mt-[0.5px] cursor-pointer'>
                <span className='md:text-base text-sm ml-[2px]'>Lit Protocol</span>
                <span className={`md:text-base text-sm ml-2 font-extralight ${_subtitleColor}`}>Gather Spaces</span>
              </div>
            </Link>
            </h1>
        </div>
    </div>
  )
}
