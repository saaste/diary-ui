import { API_URL } from "../config";

export const getAuthToken = async (email: string, password: string): Promise<string | null> => {
    const reqOpt = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
    }

    const response = await fetch(`${API_URL}/auth`, reqOpt)
    if (response.ok) {
        const body = await response.json();
        return body.token
    } else {
        if (response.status !== 401) {
            console.log(response);
        }
        return null
    }
}
