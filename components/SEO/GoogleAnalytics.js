import Script from 'next/script'

const GoogleAnalytics = () => {
    return (
        <>
            {/* Global site tag (gtag.js) - Google Analytics */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=10K11J7XGS"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '10K11J7XGS');
                `}
            </Script>
        </>
    );
}

export default GoogleAnalytics;