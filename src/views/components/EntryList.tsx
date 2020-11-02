import marked from "marked"
import React from "react"
import { timestampToDateString } from "../../utils/datetime"
import { Entry } from "../../utils/types"

interface EntryListProps {
    isLoading: boolean;
    entries: Entry[];
    entryDeleteClicked: (entry: Entry) => void;
    entryEditClicked: (entry: Entry) => void;
}

export const EntryList = ({ isLoading, entries, entryDeleteClicked, entryEditClicked }: EntryListProps): JSX.Element => {
    if (isLoading) {
        return <p>Haetaan kirjoituksia...</p>
    } else {
        return (
            <div className="entry-list">
                {entries.map((entry, index) => {
                    return (
                        <div key={index} className="entry">
                            <div className="entry-content" dangerouslySetInnerHTML={{ __html: marked(entry.content, { gfm: true }) }}></div>
                            <div className="entry-meta">
                                <p className="entry-timestamp">
                                    {timestampToDateString(entry.timestamp)}
                                </p>
                                <div className="entry-actions">
                                    <button className="edit" onClick={() => entryEditClicked(entry)}>Muokkaa</button>
                                    <button className="delete" onClick={() => entryDeleteClicked(entry)}>Poista</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
