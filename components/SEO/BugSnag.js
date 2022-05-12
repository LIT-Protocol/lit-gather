const BugSnag = ({ api }) => {
  return (
    <>
      <script src="https://d2wy8f7a9ursnm.cloudfront.net/v7/bugsnag.min.js" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
                Bugsnag.start({ apiKey: '${api}' })
                `,
        }}
      />
    </>
  );
};

export default BugSnag;
