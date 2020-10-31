import * as moment from "moment-timezone"
import React, { useState } from "react";

interface EntrySearchFormProps {
    onSearch: (query: string, from: string, to: string) => void;
}

export const EntrySearchForm = ({ onSearch }: EntrySearchFormProps): JSX.Element => {
    const [query, setQuery] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.target.id) {
            case "search":
                setQuery(e.target.value)
                break;
            case "from":
                const from = moment.tz(e.target.value, "Europe/Helsinki").set({ hour: 0, minute: 0, second: 0 }).tz("UTC").unix().toString()
                setFrom(from);
                break;
            case "to":
                const to = moment.tz(e.target.value, "Europe/Helsinki").set({ hour: 23, minute: 59, second: 59 }).tz("UTC").unix().toString()
                setTo(to);
                break;
        }
    }

    const handleSearchClick = () => {
        onSearch(query, from, to);
    }

    return (
        <div className="entry-search">
            <h2>Vanhat kirjoitukset</h2>
            <div className="input-group">
                <label htmlFor="search">Hakusana</label>
                <input type="text" id="search" onChange={handleInputOnChange} />
            </div>
            <div className="input-group">
                <label htmlFor="from">Aikarajaus</label>
                <div className="input-group-inline">
                    <input type="date" id="from" onChange={handleInputOnChange} className="date-input" />
                    <span>-</span>
                    <input type="date" id="to" onChange={handleInputOnChange} className="date-input" />
                    <button onClick={handleSearchClick}>Hae</button>
                </div>
            </div>
        </div>
    )
}
