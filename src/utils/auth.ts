import { UpdateStateFunc } from "../App"

const TOKEN_KEY = "TOKEN";

export const setAsLoggedOut = (updateState: UpdateStateFunc) => {
    localStorage.removeItem(TOKEN_KEY)
    updateState({
        isLoggedIn: false,
        token: ""
    })
}

export const setAsLoggedIn = (token: string, updateState: UpdateStateFunc) => {
    localStorage.setItem(TOKEN_KEY, token);
    updateState({
        isLoggedIn: true,
        token: token
    })
}

export const getTokenFromStorage = (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
}
