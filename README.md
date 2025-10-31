
<img style="width: 100%;" width="1338" height="280" alt="Electron-Layer-repo-banner (1)" src="https://github.com/user-attachments/assets/c39dc93b-aea0-4d79-8cac-0d452e159b51" />

# Requesty 1.2.1

**Requesty** is a lightweight JavaScript library for handling HTTP requests easily.

---

## Installation

NPM :

```bash
npm i @limbusfoundation/requesty
```

---

## Default Configuration

```javascript
const configTemplate = {
    baseUrl: "https://dummyjson.com",
    appName: "myApp",       // Application name for logs/debugging
    dataConversion: "json", // "json" or "text"
    header: {},            // Global headers
    timeout: 5000,          // Timeout in milliseconds
    retry: 0,               // Number of automatic retry attempts
    debug: false            // Enable debug logging
};
```

Create a Requesty instance:

```javascript
import { Requesty } from "requesty";

const api = new Requesty({
    baseUrl: "https://dummyjson.com",
    appName: "myApp",
    dataConversion: "json",
    header: { "Authorization": "Bearer token" },
    timeout: 7000,
    retry: 2,
    debug: true
});
```

---

## Main Properties

- **baseUrl**: Base URL for all requests.
- **appName**: Application name used for logging.
- **dataConversion**: How the response is parsed (`json` or `text`).
- **headers**: Global headers for all requests.
- **timeout**: Request timeout in milliseconds.
- **query**: query params to get on request
- **retry**: Number of automatic retry attempts for 5xx errors.
- **debug**: Enable detailed logging.
- **interceptRequest**: Function to intercept and modify requests before sending.
- **interceptResponse**: Function to intercept responses after receiving.
- **cache**: Stores successfully fetched data.</br>
...

---

## Structure

All request methods **return a Promise** that resolves to an object containing `{ success, status, data, error, controller }`.  
They also **support an optional callback** as the last argument.

**Request Mode Example - Callback | Promise | Async/Await**
```javascript
// Using callback
api.get("products", {}, (res) => {
    console.log("Callback result:", res);
});

// Using Promise
api.get("products")
   .then(res => console.log("Then result:", res))
   .catch(err => console.error(err));

// Using async/await
const res = await api.get("products");
console.log("Await result:", res);
```

## Methods

### `get(url, config, callback)`
Performs a GET request.

```javascript
await api.get("products/add",{});
```


### `post(url, config, callback)`
Performs a POST request.

```javascript
await api.post("products/add", { body: { name: "New Product" }});
```



### `put(url, config, callback)`
Performs a PUT request (full update).

```javascript
await api.put("products/1", { body: { name: "Updated Product" } });
```



### `patch(url, config, callback)`
Performs a PATCH request (partial update).

```javascript
await api.patch("/products/1", { body: { price: 19.99 } });
```


### `delete(url, config, callback)`
Performs a DELETE request.

```javascript
await api.delete("products/1", {});
```

### `cancelRequest(controller)`
Cancels an ongoing request using its AbortController.

```javascript
const { controller } = await api.get("/long-request");
api.cancelRequest(controller);
```



### `setBaseUrl(url)`
Sets a new base URL for the instance.

```javascript
api.setBaseUrl("https://newapi.example.com");
```

### `data(response)`
Filter the `data` from response 

```javascript
const response = await api.get("products");

const myData = api.data(response);

console.log("My Requesta Data " + myData);

```

### `success(response)`
Filter if the request is `ok` ( success )

```javascript
const response = await api.get("products");

const isOk = api.success(response);

if(isOk) console.log("the request is ok");
if(!isOk) console.log("the request is failed");

```

### `status(response)`
Filter the `status` from response 

```javascript
const response = await api.get("products");

const status = api.status(response);

console.log("My Requesta Status " + status);

```

### `error(response)`
Filter if the response is a `error` 

```javascript
const response = await api.get("products");

const isError = api.error(response);

if(isError) console.log("the request is Error");
if(!isError) console.log("the request is ok");

```

## Request Options

### `Query`
you can add a list of query params in `'query'` option

```javascript
await api.get("categories", {query: { search: "mycategoryName", myParam : "value" }});

// https.yourdomain/categories?search=mycategoryName?myParam=value

```

### `Route`
you can add a list of routes in `route` option

```javascript
await api.get("posts", { route: ["storys","yourPostId","otherRoute"]});

// https.yourdomain/posts/storys/yourPostId/otherRoute

```

or your can add directly inside the route : 

```javascript
await api.get("posts/storys/yourPostId/otherRoute");

// https.yourdomain/posts/storys/yourPostId/otherRoute

```

### `Body`
you can add the body of your request in `body` option

```javascript
await api.post("posts", { body: JSON.stringfy(yourJsonBody)});

await api.post("posts", { body: { filmeName : "Iron Man" }});

```

### `Header`
you can add the Headers of your request in `Header` option

```javascript
await api.post("posts", { header: { { "Authorization": "Bearer token" } });

```


## Features

1. **Request Interceptors**: Modify requests before sending.
2. **Response Interceptors**: Handle or transform responses globally.
3. **Automatic Retries**: Retry requests that fail with server errors.
4. **Timeouts**: Abort requests that take too long.
5. **Caching**: Stores responses to avoid repeated requests.
6. **Debug Mode**: Detailed logging for easier debugging.
7. **Callback Support**: Optional callback for each request.
8. **Promise-Based**: All request methods return a Promise.
9. **Filter the Response**: your can filter all data from response
9. **Custom Routes**: your can add and control routes with a list of routes

and others...

## Full Usage Example

1. requestyInstanceFile.js

```javascript
import { Requesty } from '@limbusfoundation/requesty';

// relative path : "yourRelativeFilePath/@limbusfoundation/requesty/src/requesty.js"

const config = {
    baseUrl : "https://dummyjson.com",
    appName : "yourAppName",
    dataConversion : "json",
    headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer token`,
    }
};

export const requesty = new Requesty(config);

```

2. yourRequestFile.js

```javascript

import { requesty } from "./requesty";


async function getProduct(){

    const response = await requesty.get("product");

    if(requesty.error(response)){
        console.warn("Error to get product");
        return;
    }

    const getProduct = requesty.data(response);
    
    console.log("My Product : " + getProduct);
    console.log("My Reponse : " + response)
}


```


## Response Object

All request methods return a Promise resolving to an object:

```javascript
{
  success: boolean,          // true if HTTP status is 2xx
  status: number,       // HTTP status code
  data: any,            // Parsed response (JSON or text) or null
  error: boolean,       // true if request failed
  controller: AbortController
}
```

- Supports `JSON` and `FormData` bodies.
- Timeout and retry logic ensures robust network handling.
- Debug logs can be enabled for detailed info.



## License

© 2025 Limbus Foundation & Community </br>
This project is licensed under the MIT License.
