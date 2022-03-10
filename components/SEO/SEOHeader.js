import Head from 'next/head'

export default function SEOHeader({
    subtitle, 
    description='Token-gate your gather space!',
    link='https://gather.litgateway.com/',
    image='https://gather.litgateway.com/thumbnail.png'
}){

    const title = `Lit Protocol Gather Spaces${subtitle == null ? '' : ` |  ${subtitle}`}`;

    return (
        <>
            <Head>
                <title>{ title }</title>
                <meta name="description" content={description} />

                <meta property="og:type" content="website" />
                <meta property="og:url" content={link} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={image} />

                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={link} />
                <meta property="twitter:title" content={title} />
                <meta property="twitter:description" content={description} />
                <meta property="twitter:image" content={image} />

                <link rel="icon" href="/favicon.ico" />
            </Head>
        </>
    )
}