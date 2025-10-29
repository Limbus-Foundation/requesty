










// GET STARTED : 

import { Requesty } from "../requesty.js";

const configTemplate = {
    baseUrl: "https://dummyjson.com",
    appName: "myApp",
    dataConversion: "json",
    headers: {},
    timeout: 5000,
    retry: 0,
    debug: true
};

const myReq = new Requesty(configTemplate);

// GET — 

const getRes = await myReq.get("products", { query: { limit: 3 } });
console.log("GET >", getRes);

console.log("RESULT COMPLET", getRes);
console.log("STATUS", myReq.status(getRes));
console.log("SUCCESS", myReq.success(getRes));
console.log("API DATA", myReq.data(getRes));


// POST — 

const postRes = await myReq.post("products", {
    body: {
        title: "A Cute Keyboard",
        price: 199,
        stock: 5,
        description: "A Virtual keyboard very cute!"
    }
});

console.log("POST >", postRes.data);

// PUT — 

const putRes = await myReq.put("products", {
    route: [1],
    body: {
        title: "my Keyboard",
        price: 249,
        stock: 10
    }
});
console.log("PUT >", putRes.data);

// PATCH — 

const patchRes = await myReq.patch("products", {
    route: [1],
    body: { price: 229 }
});
console.log("PATCH >", patchRes.data);

// DELETE — 

const delRes = await myReq.delete("products", { route: [1] });
console.log("DELETE >", delRes.data);
