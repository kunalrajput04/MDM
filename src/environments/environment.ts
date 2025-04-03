// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  //MDM Config
  // apiUrl: 'http://localhost:5000/api/v1.0/',
  // imageUrl: 'http://localhost:5000/',
  //smartapiUrl: 'https://meghasmarts.com:8443/rec/rest',

  apiUrl: `https://www.mdm.meghasmarts.com:9090/api/v1.0/`,
  imageUrl: 'https://www.mdm.meghasmarts.com:9090/',
  //  imageUrl: 'http://localhost:5000/',
  smartapiUrl: 'https://meghasmarts.com:8443/dlms/rest',
  //slaUrl1: 'https://meghasmarts.com:8443/sla1/rest/Evit',
  slaUrl: 'https://meghasmarts.com:8443/sla/rest/Evit',
  slaUrl2: 'https://meghasmarts.com:8443/sla2/rest/Evit',

  // smartapiUrl: 'https://meghasmarts.com:8443/rec/rest',
  // slaUrl : 'https://meghasmarts.com:8443/sla/rest/Evit',

  //REC Config
  // apiUrl: 'http://api.amisolutions.co.in/api/v1.0/',
  // imageUrl: 'http://api.amisolutions.co.in/',
  // smartapiUrl: 'https://meghasmarts.com:8443/rec/rest',

  healthLogTimeInterval: 35,
  //Vee ************************
  veeapiUrl: 'http://115.124.119.126:5000/vee/',
  veeapiUrlGetData: 'http://115.124.119.126:5000/datasets/',
  megaSmart: 'http://115.124.119.126:5000/',
  mdmVersion: '1.0.1',

  // ***********************
  demoUrlCreatePostForTesting: 'https://apimdmdb.asptask.in/api',
  demoUrlCreateGetForTesting: 'https://apimdmdb.asptask.in/api',
  // serverUrl : 'http://vee.meghasmarts.com/api',
  serverUrl: 'http://115.124.119.126:5000/api',
  serverNewUrl: 'https://vee.meghasmarts.com:5001/api',
  ser: 'http://vee.meghasmarts.com:5001/api',
  // serverUrl:'https://apimdmdb.asptask.in/api',

  //   masterapiUrl: 'http://105.112.243.15:8012/api',
  //  masterimageUrl: 'http://105.112.243.15:8012',

  //   masterapiUrl: 'http://app.amisolutions.co.in/api',
  // masterimageUrl: 'http://app.amisolutions.co.in',

  masterapiUrl: 'https://www.mdm.meghasmarts.com:8016/api',
  masterimageUrl: 'https://www.mdm.meghasmarts.com:8016',

  serverUrl1: 'https://meghasmarts.com:5066/api',
};
