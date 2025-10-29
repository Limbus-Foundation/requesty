
/*---------------------------------------------------------------------------------------------*
 *  copyright (c) 2025 Limbus Foundation & Community. CREATED IN 04/10/2025 DD/MM/YYYY         *
 *  lib repo - https://github.com/Limbus-Foundation/requesty                                   *
 *  maintainer org -  https://github.com/Limbus-Foundation                                     *
 *---------------------------------------------------------------------------------------------*/

// REQUESTY : 

import { parseParam } from "./utils/parse-param.js";

const configTemplate = {
    baseUrl: "https://dummyjson.com",
    appName: "myApp",
    dataConversion: "json",
    headers: {},
    timeout: 5000,
    retry: 0,
    debug: false,
};

export class Requesty {

    constructor(config) {

        this.baseUrl = config.baseUrl;
        this.appName = config.appName || configTemplate.appName;
        this.dataConversion = config.dataConversion || configTemplate.dataConversion;
        this.headers = config.headers || {};
        this.interceptRequest = null;
        this.interceptResponse = null;
        this.timeout = config.timeout || configTemplate.timeout;
        this.retry = config.retry || configTemplate.retry;
        this.debug = config.debug || configTemplate.debug;
        this.cache = {};
        this.paramList = null;
        
    }

    async _rFetch(url, method, headers = {}, body) {

        let finalConfig = {
            url: `${this.baseUrl.replace(/\/$/, "")}/${url}`,
            method,
            headers: { ...this.headers, ...headers },
            body
        };

        if (body && typeof body === "object" && !(body instanceof FormData)) {
            finalConfig.body = JSON.stringify(body);
            finalConfig.headers["Content-Type"] = "application/json";
        }

        if (body instanceof FormData) {
            delete finalConfig.headers["Content-Type"];
        }

        if (typeof this.interceptRequest === "function") {
            try {
                const intercepted = await this.interceptRequest(finalConfig);
                if (intercepted) finalConfig = intercepted;
            } catch (err) {
                if (this.debug) console.error(`${this.appName} Request Interceptor Error >`, err);
            }
        }

        let attempts = this.retry + 1;

        while (attempts > 0) {

            attempts--;

            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            try {
                const response = await fetch(finalConfig.url, {
                    method: finalConfig.method,
                    headers: finalConfig.headers,
                    body: finalConfig.body,
                    signal
                });

                clearTimeout(timeoutId);

                if (typeof this.interceptResponse === "function") {
                    try {
                        await this.interceptResponse(response.clone());
                    } catch (err) {
                        if (this.debug) console.error(`${this.appName} Response Interceptor Error >`, err);
                    }
                }

                let data;
                try {
                    data = this.dataConversion === "text"
                        ? await response.text()
                        : await response.json();
                } catch {
                    data = null;
                }

                const result = {
                    success: response.ok,
                    status: response.status,
                    data,
                    controller
                };

                if (!response.ok) {
                    if (attempts > 0 && response.status >= 500) {
                        if (this.debug)
                            console.warn(`${this.appName} Retrying (${this.retry - attempts})...`);
                        continue;
                    }
                    if (this.debug)
                        console.error(`${this.appName} Fetch Error > ${response.status}`);
                    return { ...result, error: true };
                }

                this.cache[finalConfig.url] = data;

                if (this.debug)
                    console.info(`[${this.appName}] ${method} ${url}`, result);

                return result;

            } catch (err) {
                clearTimeout(timeoutId);

                if (err.name === "AbortError") {
                    if (this.debug)
                        console.warn(`${this.appName} Request Timeout > ${this.timeout}ms`);
                    return { error: true, message: "Timeout", success: false, controller };
                }

                if (attempts > 0) {
                    if (this.debug)
                        console.warn(`${this.appName} Retrying (${this.retry - attempts})...`);
                    continue;
                }

                if (this.debug)
                    console.error(`${this.appName} Request Error >`, err.message);
                return { error: true, message: err.message, success: false, controller };
            }
        }
    }

    data(response) {
        if (response && response.data) return response.data;
    }

    success(response) {
        if (response && typeof response.success !== "undefined") return response.success;
    }

    status(response) {
        if (response && typeof response.status !== "undefined") return response.status;
    }

    error(response) {
        if (response && typeof response.error !== "undefined") return response.error;
    }


    cancelRequest(controller) {
        if (controller) controller.abort();
    }

    setBaseUrl(url) {
        this.baseUrl = url;
    }

    _param(params){
        const query = parseParam(params);
        return query;
    }

    _parseRoute(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return "";
        const valid = arr.filter(v => v !== undefined && v !== null && v !== "");
        return valid.length ? "/" + valid.join("/") : "";
    }


    async get(url, config = {}, callback) {
        const res = await this._rFetch(`${url}${this._parseRoute(config.route)}${this._param(config.query)}`, "GET", config.headers);
        callback && callback(res);
        return res;
    }

    async post(url, config = {}, callback) {
        const res = await this._rFetch(`${url}${this._parseRoute(config.route)}${this._param(config.query)}`, "POST", config.headers, config.body);
        callback && callback(res);
        return res;
    }

    async put(url, config = {}, callback) {
        const res = await this._rFetch(`${url}${this._parseRoute(config.route)}${this._param(config.query)}`, "PUT", config.headers, config.body);
        callback && callback(res);
        return res;
    }

    async patch(url, config = {}, callback) {
        const res = await this._rFetch(`${url}${this._parseRoute(config.route)}${this._param(config.query)}`, "PATCH", config.headers, config.body);
        callback && callback(res);
        return res;
    }

    async delete(url, config = {}, callback) {
        const res = await this._rFetch(`${url}${this._parseRoute(config.route)}${this._param(config.query)}`, "DELETE", config.headers);
        callback && callback(res);
        return res;
    }
}
