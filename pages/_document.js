import Document, { Html, Head, Main, NextScript } from "next/document";
import BugSnag from "../components/SEO/BugSnag";
import GoogleAnalytics from "../components/SEO/GoogleAnalytics";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
            <GoogleAnalytics id="G-10K11J7XGS"/>
            <BugSnag api="de6a70577c09320662365bca4488a0e2"/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
