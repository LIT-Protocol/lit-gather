import Head from 'next/head'

export default function SEOHeader({subtitle}){

    const title = `Lit-Gather Space${subtitle == null ? '' : `::  ${subtitle}`}`;
    const description = 'Token-gate your gather space!';

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