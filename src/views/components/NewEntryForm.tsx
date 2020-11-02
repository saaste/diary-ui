import marked from "marked";
import React, { useState } from "react";
import { createEntry } from "../../clients/entries";

interface NewEntryFormProps {
    entrySaved: (unauthorized: boolean) => void;
}

export const NewEntryForm = ({ entrySaved }: NewEntryFormProps): JSX.Element => {
    const [content, setContent] = useState("")
    const [isSaving, setIsSaving] = useState(false);
    const [isSavedClass, setIsSavedClass] = useState("entry-saved");
    const [showPreview, setShowPreview] = useState(false);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value)
    }

    const handleOnSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await createEntry(content);
        if (response.data) {
            setContent("")
            entrySaved(response.authorized);
            setIsSavedClass(`${isSavedClass} active`)
            setTimeout(() => {
                setIsSavedClass("entry-saved")
            }, 5000);
        }
        setIsSaving(false);
    }

    const togglePreview = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setShowPreview(!showPreview);
    }

    return (
        <div className="new-entry-form">
            <h2>Uusi kirjoitus</h2>
            <form onSubmit={handleOnSubmit}>
                <div className="input-group">
                    {showPreview
                        ? <div className="entry-preview" dangerouslySetInnerHTML={{ __html: marked(content, { gfm: true }) || "" }} />
                        : <textarea id="content" onChange={handleContentChange} value={content} disabled={isSaving}></textarea>
                    }
                </div>
                <div className="new-entry-buttons">
                    <div className={isSavedClass}>Kirjoitus tallennettu</div>
                    <button className="preview-button" onClick={togglePreview}>{showPreview ? "Muokkaus" : "Esikatselu"}</button>
                    <button className="save" disabled={content === "" || isSaving}>Tallenna</button>
                </div>
            </form>
        </div>
    )
}
