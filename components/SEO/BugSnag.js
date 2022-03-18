const BugSnag = ({api}) => {
    return (
        <>
        <script 
            async
            src="https://d2wy8f7a9ursnm.cloudfront.net/v7/bugsnag.min.js" 
        />
        <script
            dangerouslySetInnerHTML={{
            __html: `
                Bugsnag.start({ apiKey: '${api}' })
                `,
            }}
        />
        </>
    );
}

export default BugSnag;