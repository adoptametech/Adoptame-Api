import "dotenv/config";
import swaggerAutogen from 'swagger-autogen';
let { NODE_ENV, URL_DEPLOYED_BACKEND } = process.env;
const doc = {
  info: {
    title: 'Api Rest Adoptame',
    description: 'Todas las rutas del Back :)',
    version: 'v1.0.0',
  }, tags: [        // by default: empty Array
    {
      name: 'LOGIN',         // Tag name
      description: 'Obten tu token y pegalo en "AUTORIZE" para usar todas las rutas protegidas',  // Tag description
    },
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'Authorization', // name of the header, query parameter or cookie
      description: 'Ingresa el token del login: '
    }
  },
  host: NODE_ENV === 'production'
    ? URL_DEPLOYED_BACKEND.replace('https://', '')
    : 'localhost:5000',
  schemes: [NODE_ENV === 'production' ? 'https' : 'http'],
};

const outputFile = './swagger_output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
  NODE_ENV === 'production'
    ? await import('./index.js')
    : console.log('Documentación generada :)');
});