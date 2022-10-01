// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '...'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // Auth0 domain
  domain: 'dev-ld1m3p9a.us.auth0.com',         
  // Auth0 client id   
  clientId: 'vu2Nqlp1xsibSWFDR79M0HlyOr2KsvQ6',
  callbackUrl: 'http://localhost:3000/callback'
}
