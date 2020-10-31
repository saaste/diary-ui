import * as moment from "moment-timezone";
import React, { useState } from "react";
import { createEntry } from "../../clients/entries";

interface NewEntryFormProps {
    entrySaved: (unauthorized: boolean) => void;
}

export const NewEntryForm = ({ entrySaved }: NewEntryFormProps): JSX.Element => {
    const [content, setContent] = useState("")
    const [isSaving, setIsSaving] = useState(false);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value)
    }

    const handleOnSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await createEntry(content);
        if (response.data) {
            setContent("")
            entrySaved(response.authorized);
        }
        setIsSaving(false);
    }

    return (
        <div className="new-entry-form">
            <h2>Uusi kirjoitus</h2>
            <form onSubmit={handleOnSubmit}>
                <div className="input-group">
                    <textarea id="content" onChange={handleContentChange} value={content} disabled={isSaving}></textarea>
                </div>
                <button disabled={content === "" || isSaving}>Tallenna</button>
            </form>
        </div>
    )
}
