
/*---------------------------------------------------------------------------------------------*
 *  copyright (c) 2025 Limbus Foundation & Community. CREATED IN 04/10/2025 DD/MM/YYYY         *
 *  lib repo - https://github.com/Limbus-Foundation/requesty                                   *
 *  maintainer org -  https://github.com/Limbus-Foundation                                     *
 *---------------------------------------------------------------------------------------------*/

let paramList;

export function parseParam(params = {}) {
    if (typeof params !== "object" || Array.isArray(params) || Object.keys(params).length === 0)
        return "";

    paramList = new URLSearchParams();

    for (const key in params) {
        const value = params[key];
        if (value !== undefined && value !== "") {
            paramList.append(key, value);
        }
    }

    return `?${paramList.toString()}`;
}



