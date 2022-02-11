//
// Compose a gather redirect url 
// @param { Object } param
// @property { String } host
// @property { String } endpoint
// @property { Array } queries
// @return { String } redirect url
//
export const getGatherRedirectUrl = (param) => {

    console.warn("↓↓↓↓↓ getGatherRedirectUrl ↓↓↓↓↓");
        
    // -- debug
    console.log(`✅  host: ${param.host}`);
    console.log(`✅  endpoint: ${param.endpoint}`);
    param.queries.forEach((q) => {
        console.log("✅  query:", q);
    });

    // -- prepare
    const redirectUrl = param.host + param.endpoint + combinedQueries(param.queries);
    console.log(`✅  redirectUrl(backend API): ${redirectUrl}`);
    
    const encodedRedirectUrl = encodeURIComponent(redirectUrl);
    console.log(`✅  encodedRedirectUrl: ${encodedRedirectUrl}`);
    
    const gatherUrl = 'https://gather.town/getPublicId?redirectTo=';
    console.log(`✅  gatherUrl: ${gatherUrl}`);
    
    const redirectGatherUrl = gatherUrl + encodedRedirectUrl;
    console.log(`✅  redirectGatherUrl: ${redirectGatherUrl}`);

    return redirectGatherUrl;
}

//
// Combined queries into a single string
// @param { Array } queries
// @return { void }
//
const combinedQueries = (queries) => {
    var _queries = '';
    queries.forEach((q) => _queries += new URLSearchParams(q).toString() + '&');
    return _queries;
}