import React from "react"
import { timestampToDateString } from "../../utils/datetime"
import { Entry } from "../../utils/types"

interface EntryListProps {
    isLoading: boolean;
    entries: Entry[];
    entryDeleteClicked: (entry: Entry) => void;
}

export const EntryList = ({ isLoading, entries, entryDeleteClicked }: EntryListProps): JSX.Element => {
    if (isLoading) {
        return <p>Haetaan kirjoituksia...</p>
    } else {
        return (
            <div className="entry-list">
                {entries.map((entry, index) => {
                    return (
                        <div key={index} className="entry">
                            <div className="entry-content">{entry.content}</div>
                            <div className="entry-meta">
                                <p className="entry-timestamp">
                                    <small>{timestampToDateString(entry.timestamp)}</small>
                                </p>
                                <button className="delete" onClick={() => entryDeleteClicked(entry)}>Poista</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
