import Head from 'next/head'

export default function SEOHeader({
    subtitle, 
    description='Token-gate your gather space!'
}){

    const title = `Lit-Gather Space${subtitle == null ? '' : `::  ${subtitle}`}`;

    return (
        <>
            <Head>
                <title>{ title }</title>
                <meta name="description" content={description} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
        </>
    )
}