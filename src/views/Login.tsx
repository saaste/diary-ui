import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { UpdateStateFunc } from "../App"
import { getAuthToken } from "../clients/auth";
import { setAsLoggedIn } from "../utils/auth";

interface LoginProps {
    updateState: UpdateStateFunc;
}

const Login = ({ updateState }: LoginProps) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState("")
    const history = useHistory();

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.target.id) {
            case "email":
                setEmail(e.target.value);
                break;
            case "password":
                setPassword(e.target.value);
                break;
        }
    }

    const handleLogIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        logIn();
    }

    const logIn = async () => {
        const token = await getAuthToken(email, password);
        if (!token) {
            setLoginError("Väärä tunnus tai salasana");
            return;
        }
        setAsLoggedIn(token, updateState);
        history.push("/")
    }

    return (
        <div className="login-form">
            <form onSubmit={handleLogIn}>
                <div className="input-group">
                    <label htmlFor="email">Sähköpostiosoite</label>
                    <input type="text" id="email" onChange={handleOnChange} />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Salasana</label>
                    <input type="password" id="password" onChange={handleOnChange} />
                </div>

                <button type="submit">Kirjaudu sisään</button> <span className="error">{loginError}</span>
            </form>
        </div>
    )
}

export default Login
