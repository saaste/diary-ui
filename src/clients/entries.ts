import { getTokenFromStorage } from "../utils/auth";
import { Entry } from "../utils/types";
import { API_URL } from "../config"
import * as moment from "moment-timezone";

export interface Response<T> {
    data: T;
    authorized: boolean
}


const getHeaders = (): { [key: string]: string } => {
    return {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${getTokenFromStorage()}`
    }
}

export const fetchEntries = async (query: string = "", from: string = "", to: string = ""): Promise<Response<Entry[]>> => {
    const reqOpt = { method: 'GET', headers: getHeaders() }
    let url = `${API_URL}/entries?`

    if (query) {
        url += `q=${encodeURIComponent(query)}&`
    }

    if (from) {
        url += `from=${encodeURIComponent(from)}&`
    }

    if (to) {
        url += `to=${encodeURIComponent(to)}`
    }

    const response = await fetch(url, reqOpt)
    let entries: Entry[] = [];

    if (!response.ok) {
        if (response.status !== 401) {
            console.log("Fetching entries failed");
            console.error(response);
        }
    } else {
        entries = await response.json() as Entry[];
    }

    return {
        data: entries,
        authorized: response.status !== 401
    };
}

export const createEntry = async (content: string): Promise<Response<boolean>> => {
    const payload = {
        content: content,
        timestamp: Math.floor(moment.utc().unix())
    }

    const request = {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    }

    const response = await fetch(`${API_URL}/entries`, request)

    const value = {
        data: true,
        authorized: response.status !== 401
    }

    if (!response.ok) {
        value.data = false;
        if (response.status !== 401) {
            console.log("Creating an entry failed");
            console.error(response)
        }
    }

    return value;
}

export const updateEntry = async (entry: Entry | null): Promise<Response<boolean>> => {
    if (entry === null) {
        return {
            data: false,
            authorized: true,
        }
    }
    
    const request = {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(entry)
    }

    const response = await fetch(`${API_URL}/entries/${entry.id}`, request);

    const value = {
        data: true,
        authorized: response.status !== 401
    }

    if (!response.ok) {
        value.data = false;
        if (response.status !== 401) {
            console.log("Updating an entry failed");
            console.error(response);
        }
    }

    return value;
}

export const deleteEntry = async (entryId: string): Promise<Response<void>> => {
    const reqOpt = { method: 'DELETE', headers: getHeaders() }
    let url = `${API_URL}/entries/${entryId}`

    const response = await fetch(url, reqOpt)

    if (!response.ok) {
        if (response.status !== 401) {
            console.log("Deleting entry failed")
            console.error(response)
        }
    }

    return {
        data: undefined,
        authorized: response.status !== 401
    }
}
