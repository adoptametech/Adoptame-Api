import { auth } from "express-oauth2-jwt-bearer";

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
export const checkJwt = auth({
  audience: "https://api-adoptame-dev.herokuapp.com/docs/",
  issuerBaseURL: `https://dev-s-kmhkyz.us.auth0.com/`,
});
