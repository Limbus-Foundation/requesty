










// GET STARTED : 

import { Requesty } from "../requesty.js";

const configTemplate = {
    baseUrl: "https://dummyjson.com",
    appName: "myApp",
    dataConversion: "json",
    headers: {},
    timeout: 5000,
    retry: 0,
    debug: false
};

const myReq = new Requesty(configTemplate);

myReq.get("product",{},(data)=>{
    console.log("PRODUCT " + JSON.stringify(data) );
});