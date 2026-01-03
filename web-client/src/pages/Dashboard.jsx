import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "@/hooks/useApi";
import SearchBar from "@/components/SearchBar";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {toast} from "sonner";

function NotesSkeletonCard() {
    return (
        <Card className="flex flex-col justify-between">
            <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-28" />
            </CardFooter>
        </Card>
    );
}

const NotesDashboard = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({});

    const api = useApi();

    // Fetch all notes
    const fetchNotes = async () => {
        try {

            const { data } = await api.get("/notes");
            const list = Array.isArray(data) ? data : data.notes || [];
            setNotes(list);
        } catch (err) {
            toast.error(err?.message || err);
        } finally {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // Advanced search and filter logic
    const filteredNotes = useMemo(() => {
        let result = [...notes];

        // Search by name, description, and summarised content
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter((note) => {
                const name = (note.name || "").toLowerCase();
                const description = (note.description || "").toLowerCase();
                const summary = (note.summarised_content || "").toLowerCase();
                const content = (note.content || "").toLowerCase();

                return (
                    name.includes(term) ||
                    description.includes(term) ||
                    summary.includes(term) ||
                    content.includes(term)
                );
            });
        }

        // Filter by favourite status
        if (filters.favourite === "true") {
            result = result.filter((note) => note.isFavourite);
        } else if (filters.favourite === "false") {
            result = result.filter((note) => !note.isFavourite);
        }

        // Filter by collection
        if (filters.collection) {
            result = result.filter((note) => {
                const collectionName =
                    note.collection?.name || note.collection || "";
                return collectionName === filters.collection;
            });
        }

        // Sort by date (newest first by default)
        if (filters.sortBy === "oldest") {
            result.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
        } else if (filters.sortBy === "name") {
            result.sort((a, b) =>
                (a.name || "").localeCompare(b.name || "")
            );
        } else {
            // Default: newest first
            result.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        }

        return result;
    }, [notes, searchTerm, filters]);

    // Extract unique collections for filter dropdown
    const collectionOptions = useMemo(() => {
        const collections = new Set();
        notes.forEach((note) => {
            const collectionName = note.collection?.name || note.collection;
            if (collectionName) {
                collections.add(collectionName);
            }
        });
        return Array.from(collections).map((name) => ({
            label: name,
            value: name,
        }));
    }, [notes]);

    const handleOpenVideo = (note, e) => {
        if (e) e.stopPropagation();
        if (!note?.videoUrl) return;
        window.open(note.videoUrl, "_blank", "noopener,noreferrer");
    };

    const handleToggleFavourite = async (notesId, e) => {
        if (e) e.stopPropagation();

        // Optimistic update
        setNotes((prev) =>
            prev.map((note) =>
                note._id === notesId
                    ? { ...note, isFavourite: !note.isFavourite }
                    : note
            )
        );

        try {
            await api.post("/notes/toggle-favourite", { notesId });
        } catch (err) {
            console.error(err);
            // Revert on error
            setNotes((prev) =>
                prev.map((note) =>
                    note._id === notesId
                        ? { ...note, isFavourite: !note.isFavourite }
                        : note
                )
            );
        }
    };

    const handleCardClick = (notesId) => {
        navigate(`/notes/${notesId}`);
    };

    const handleSearch = (term, newFilters) => {
        setSearchTerm(term);
        setFilters(newFilters);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Filter options for SearchBar
    const filterOptions = [
        {
            label: "",
            value: "sortBy",
            options: [
                { label: "Newest First", value: "newest" },
                { label: "Oldest First", value: "oldest" },
                { label: "Name (A-Z)", value: "name" },
            ],
        },
    ];

    // Add collection filter if collections exist
    if (collectionOptions.length > 0) {
        filterOptions.push({
            label: "Collection",
            value: "collection",
            options: collectionOptions,
        });
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-6xl px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight">
                                Notes Dashboard
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                All your notes in one place. Click a note card to
                                view full details.
                            </p>
                        </div>

                        <Button variant="outline" size="sm" onClick={fetchNotes}>
                            Refresh
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Search notes by name, description, or content..."
                        filterOptions={filterOptions}
                        debounceMs={300}
                    />

                    {/* Results Count */}
                    {!initialLoading && (
                        <p className="mt-3 text-sm text-muted-foreground">
                            Showing {filteredNotes.length} of {notes.length} notes
                        </p>
                    )}
                </div>

                {/* Loading state (only on initial load) */}
                {initialLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <NotesSkeletonCard key={idx} />
                        ))}
                    </div>
                ) : filteredNotes.length === 0 ? (
                    // Empty state
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
                        <p className="text-lg font-medium">
                            {searchTerm || Object.keys(filters).length > 0
                                ? "No notes match your search"
                                : "No notes found"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {searchTerm || Object.keys(filters).length > 0
                                ? "Try adjusting your search or filters"
                                : "Once you add notes from the backend, they will appear here."}
                        </p>
                    </div>
                ) : (
                    // Notes grid
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredNotes.map((note) => (
                            <Card
                                key={note._id}
                                className="flex cursor-pointer flex-col justify-between transition hover:shadow-md hover:scale-[1.02]"
                                onClick={() => handleCardClick(note._id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleCardClick(note._id);
                                    }
                                }}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="line-clamp-1">
                                                {note.name || "Untitled Notes"}
                                            </CardTitle>
                                            <CardDescription className="mt-1 text-xs">
                                                {note.collection?.name
                                                    ? `Collection: ${note.collection.name}`
                                                    : note.collection
                                                        ? `Collection: ${note.collection}`
                                                        : "No collection"}
                                            </CardDescription>
                                        </div>
                                        {note.isFavourite && (
                                            <Badge variant="default" className="shrink-0">
                                                ★
                                            </Badge>
                                        )}
                                    </div>
                                    {note.createdAt && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {formatDate(note.createdAt)}
                                        </p>
                                    )}
                                </CardHeader>

                                <CardContent className="space-y-2 text-sm">
                                    {note.description && (
                                        <p className="line-clamp-2 text-muted-foreground">
                                            {note.description}
                                        </p>
                                    )}

                                    {note.summarised_content && (
                                        <div className="mt-2 rounded-md bg-muted/60 p-2 text-xs">
                                            <p className="font-medium">Summary</p>
                                            <p className="mt-1 line-clamp-3 text-muted-foreground">
                                                {note.summarised_content}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="flex items-center justify-between gap-2">
                                    <Button
                                        size="sm"
                                        className="flex-1"
                                        onClick={(e) => handleOpenVideo(note, e)}
                                        disabled={!note.videoUrl}
                                    >
                                        Watch
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant={note.isFavourite ? "default" : "outline"}
                                        onClick={(e) =>
                                            handleToggleFavourite(note._id, e)
                                        }
                                    >
                                        {note.isFavourite ? "★" : "☆"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesDashboard;