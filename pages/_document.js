import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=G-10K11J7XGS`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-10K11J7XGS', {
                        page_path: window.location.pathname,
                    });
                `,
            }}
          />
          <script src="//d2wy8f7a9ursnm.cloudfront.net/v7/bugsnag.min.js"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                Bugsnag.start({ apiKey: 'de6a70577c09320662365bca4488a0e2' })
                `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
