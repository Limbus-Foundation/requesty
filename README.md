<img style="width: 100%; box-sizing: border-box;" src="https://github.com/user-attachments/assets/3c30a01c-628c-4cf5-a18e-9176ff4f0de8" alt="Limbus Foundation Logo" width="200">



# Requesty Library

**Requesty** is a lightweight JavaScript library for handling HTTP requests easily. It supports interceptors, caching, retries, and configurable timeouts.

---

## Installation

```bash
npm install requesty
```

---

## Default Configuration

```javascript
const configTemplate = {
    baseUrl: "https://dummyjson.com",
    appName: "myApp",       // Application name for logs/debugging
    dataConversion: "json", // "json" or "text"
    headers: {},            // Global headers
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
    headers: { "Authorization": "Bearer token" },
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
- **retry**: Number of automatic retry attempts for 5xx errors.
- **debug**: Enable detailed logging.
- **interceptRequest**: Function to intercept and modify requests before sending.
- **interceptResponse**: Function to intercept responses after receiving.
- **cache**: Stores successfully fetched data.

---

## Methods

All request methods **return a Promise** that resolves to an object containing `{ ok, status, data, error, controller }`.  
They also **support an optional callback** as the last argument.

### `get(url, config, callback)`
Performs a GET request.

**Example:**
```javascript
// Using callback
api.get("/products", {}, (res) => {
    console.log("Callback result:", res);
});

// Using Promise
api.get("/products")
   .then(res => console.log("Then result:", res))
   .catch(err => console.error(err));

// Using async/await
const res = await api.get("/products");
console.log("Await result:", res);
```

---

### `post(url, config, callback)`
Performs a POST request.

```javascript
await api.post("/products/add", {
    headers: { "X-Test": "true" },
    body: { name: "New Product" }
}, (res) => console.log("Callback POST:", res));
```

---

### `put(url, config, callback)`
Performs a PUT request (full update).

```javascript
await api.put("/products/1", { body: { name: "Updated Product" } });
```

---

### `patch(url, config, callback)`
Performs a PATCH request (partial update).

```javascript
await api.patch("/products/1", { body: { price: 19.99 } });
```

---

### `delete(url, config, callback)`
Performs a DELETE request.

```javascript
await api.delete("/products/1", {}, (res) => console.log("DELETE Callback:", res));
```

---

### `cancelRequest(controller)`
Cancels an ongoing request using its AbortController.

```javascript
const { controller } = await api.get("/long-request");
api.cancelRequest(controller);
```

---

### `setBaseUrl(url)`
Sets a new base URL for the instance.

```javascript
api.setBaseUrl("https://newapi.example.com");
```

---

## Features

1. **Request Interceptors**: Modify requests before sending.
2. **Response Interceptors**: Handle or transform responses globally.
3. **Automatic Retries**: Retry requests that fail with server errors.
4. **Timeouts**: Abort requests that take too long.
5. **Caching**: Stores responses to avoid repeated requests.
6. **Debug Mode**: Detailed logging for easier debugging.
7. **Callback Support**: Optional callback for each request.
8. **Promise-Based**: All request methods return a Promise.

---

## Full Usage Example

```javascript
const api = new Requesty({ baseUrl: "https://dummyjson.com", debug: true });

api.get("/products")
    .then(res => {
        console.log("Products:", res.data);
        return api.post("/products/add", { body: { name: "Snack Product" } });
    })
    .then(res => console.log("Created:", res.data))
    .catch(err => console.error("Error:", err));

// Using async/await with optional callback
const result = await api.get("/products", {}, (res) => {
    console.log("Callback result:", res);
});
console.log(result);
```

---

## Response Object

All request methods return a Promise resolving to an object:

```javascript
{
  ok: boolean,          // true if HTTP status is 2xx
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

This project is licensed under the MIT License.
