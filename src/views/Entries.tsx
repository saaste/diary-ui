import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { RootState, UpdateStateFunc } from "../App";
import { deleteEntry, fetchEntries } from "../clients/entries";
import { setAsLoggedOut } from "../utils/auth";
import { sleep } from "../utils/sleep";
import { Entry } from "../utils/types";
import { EntryList } from "./components/EntryList";
import { EntrySearchForm } from "./components/EntrySearchForm";
import { NewEntryForm } from "./components/NewEntryForm";

interface EntriesProps {
    rootState: RootState;
    updateState: UpdateStateFunc;
}

interface SearchFields {
    query: string;
    from: string;
    to: string;
}

const defaultSearchFields: SearchFields = { query: "", from: "", to: "" }



const Entries = ({ rootState, updateState }: EntriesProps) => {
    const history = useHistory();
    const [entries, setEntries] = useState<Array<any>>([]);
    const [searchFields, setSearchFields] = useState<SearchFields>(defaultSearchFields)
    const [isLoadingEntries, setIsLoadingEntries] = useState(true);
    const [entryToDelete, setEntryToDelete] = useState<Entry | null>(null);

    const redirectToLogin = () => {
        setAsLoggedOut(updateState);
        history.push("/login")

    }

    const handleLogOut = (e: React.MouseEvent) => {
        e.preventDefault();
        redirectToLogin();
    }

    const handleOnSearch = async (query: string, from: string, to: string) => {
        setSearchFields({ query: query, from: from, to: to })
    }

    const handleEntrySaved = async (authorized: boolean) => {
        if (!authorized) {
            redirectToLogin();
        } else {
            await sleep(1000); // TODO: Apparently Cosmic DB does not return new entries immediately so wait a little before refresh. Figure out why
            await refreshEntries()
        }

    }

    const handleDeleteClick = (entry: any) => {
        setEntryToDelete(entry);
    }

    const handleCancelDeletionClick = () => {
        setEntryToDelete(null);
    }

    const handleSubmitDeletionClick = async () => {
        const entryId = entryToDelete?.id || ""
        const deleteREsponse = await deleteEntry(entryId)
        if (!deleteREsponse.authorized) {
            redirectToLogin()
            return;
        }
        setEntryToDelete(null);
        await refreshEntries();
    }

    const refreshEntries = async () => {
        const { query, from, to } = searchFields;

        setIsLoadingEntries(true);

        const entryResponse = await fetchEntries(query, from, to)
        if (!entryResponse.authorized) {
            redirectToLogin();
            return;
        } else { }
        setEntries(entryResponse.data)
        setIsLoadingEntries(false);
    }

    useEffect(() => {
        if (rootState.isLoggedIn) {
            refreshEntries();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchFields])

    return (
        <div className="entries">
            <header>
                <h1>Päiväkirja</h1>
                <button onClick={handleLogOut}>Kirjaudu ulos</button>
            </header>

            <div className="diary-container">
                <NewEntryForm entrySaved={handleEntrySaved} />

                <div className="entries">
                    <EntrySearchForm onSearch={handleOnSearch} />
                    <EntryList isLoading={isLoadingEntries} entries={entries} entryDeleteClicked={handleDeleteClick} />
                </div>

            </div>

            {entryToDelete !== null &&
                <div id="entry-delete-dialog">
                    <div>
                        <h4>Haluatko varmasti poistaa kirjoituksen?</h4>
                        <div className="entry-content">
                            {entryToDelete?.content.substr(0, 200)}
                        </div>
                        <div className="input-group-inline">
                            <button className="error" id="confirm-delete" onClick={handleSubmitDeletionClick}>Kyllä</button>
                            <button id="cancel-delete" onClick={handleCancelDeletionClick}>Peruuta</button>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}

export default Entries
