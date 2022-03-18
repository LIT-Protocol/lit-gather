import Document, { Html, Head, Main, NextScript } from "next/document";
import GoogleAnalytics from "../components/SEO/GoogleAnalytics";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
            <GoogleAnalytics id="G-10K11J7XGS"/>
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
