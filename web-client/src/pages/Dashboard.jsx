import { useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
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
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const api = useApi();

    // details state
    const [selectedNotes, setSelectedNotes] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");

    // Fetch all notes
    const fetchNotes = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await api.get("/notes");

            // backend: { data: [...] } or { data: { notes: [...] } }
            const data = res.data.data;
            const list = Array.isArray(data) ? data : data.notes || [];
            setNotes(list);
        } catch (err) {
            console.error(err);
            setError(
                err?.response?.data?.message || "Failed to load notes. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleOpenVideo = (notes, e) => {
        // avoid triggering card click
        if (e) e.stopPropagation();
        if (!notes?.videoUrl) return;
        window.open(notes.videoUrl, "_blank", "noopener,noreferrer");
    };

    const handleToggleFavourite = async (notesId, e) => {
        // avoid triggering card click
        if (e) e.stopPropagation();

        // Optimistic update
        setNotes((prev) =>
            prev.map((lec) =>
                lec._id === notesId
                    ? { ...lec, isFavourite: !lec.isFavourite }
                    : lec
            )
        );

        try {
            await api.post("/notes/toggle-favourite", { notesId });
        } catch (err) {
            console.error(err);
            // Revert on error
            setNotes((prev) =>
                prev.map((lec) =>
                    lec._id === notesId
                        ? { ...lec, isFavourite: !lec.isFavourite }
                        : lec
                )
            );
        }
    };

    const fetchNotesDetails = async (notesId) => {
        if (!notesId) return;
        try {
            setDetailLoading(true);
            setDetailError("");

            const res = await api.get(`/notes/${notesId}`);

            // backend could respond as { data: notes } or { notes } or notes itself
            const payload = res.data;
            const notes =
                payload.data || payload.notes || payload;

            setSelectedNotes(notes);
        } catch (err) {
            console.error(err);
            setDetailError(
                err?.response?.data?.message ||
                "Failed to load notes details. Please try again."
            );
        } finally {
            setDetailLoading(false);
        }
    };

    const handleSelectNotes = (notesId) => {
        fetchNotesDetails(notesId);
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

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-6xl px-4 py-8">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Notes Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            All your notes in one place. Click a notes to view full
                            details, or watch and mark favourites.
                        </p>
                    </div>

                    <Button variant="outline" size="sm" onClick={fetchNotes}>
                        Refresh
                    </Button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 rounded-lg border border-destructive bg-destructive/10 px-4 py-2 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {/* Loading state */}
                {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <NotesSkeletonCard key={idx} />
                        ))}
                    </div>
                ) : notes.length === 0 ? (
                    // Empty state
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
                        <p className="text-lg font-medium">No notes found</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Once you add notes from the backend, they will appear here.
                        </p>
                    </div>
                ) : (
                    // Notes grid
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {notes.map((notes) => (
                            <Card
                                key={notes._id}
                                className="flex cursor-pointer flex-col justify-between transition hover:shadow-md"
                                onClick={() => handleSelectNotes(notes._id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSelectNotes(notes._id);
                                    }
                                }}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <CardTitle className="line-clamp-1">
                                                {notes.name || "Untitled Notes"}
                                            </CardTitle>
                                            <CardDescription className="mt-1 text-xs">
                                                {notes.collection?.name
                                                    ? `Collection: ${notes.collection.name}`
                                                    : notes.collection
                                                        ? `Collection: ${notes.collection}`
                                                        : "No collection"}
                                            </CardDescription>
                                        </div>
                                        {notes.isFavourite && (
                                            <Badge variant="default" className="shrink-0">
                                                ★ Favourite
                                            </Badge>
                                        )}
                                    </div>
                                    {notes.createdAt && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Added on {formatDate(notes.createdAt)}
                                        </p>
                                    )}
                                </CardHeader>

                                <CardContent className="space-y-2 text-sm">
                                    {notes.description && (
                                        <p className="line-clamp-2 text-muted-foreground">
                                            {notes.description}
                                        </p>
                                    )}

                                    {notes.summarised_content && (
                                        <div className="mt-2 rounded-md bg-muted/60 p-2 text-xs">
                                            <p className="font-medium">Summary</p>
                                            <p className="mt-1 line-clamp-3 text-muted-foreground">
                                                {notes.summarised_content}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="flex items-center justify-between gap-2">
                                    <Button
                                        size="sm"
                                        className="flex-1"
                                        onClick={(e) => handleOpenVideo(notes, e)}
                                        disabled={!notes.videoUrl}
                                    >
                                        Watch video
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant={notes.isFavourite ? "default" : "outline"}
                                        onClick={(e) =>
                                            handleToggleFavourite(notes._id, e)
                                        }
                                    >
                                        {notes.isFavourite ? "Unfavourite" : "Favourite"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Selected notes details */}
                <div className="mt-8">
                    {detailLoading && (
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-40" />
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-5 w-1/2" />
                                    <Skeleton className="mt-2 h-4 w-1/3" />
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-2/3" />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {detailError && (
                        <div className="mb-3 rounded-lg border border-destructive bg-destructive/10 px-4 py-2 text-sm text-destructive">
                            {detailError}
                        </div>
                    )}

                    {selectedNotes && !detailLoading && (
                        <div>
                            <h2 className="mb-3 text-xl font-semibold tracking-tight">
                                Notes details
                            </h2>
                            <Card className="border">
                                <CardHeader>
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <CardTitle>
                                                {selectedNotes.name || "Untitled Notes"}
                                            </CardTitle>
                                            {selectedNotes.description && (
                                                <CardDescription className="mt-1">
                                                    {selectedNotes.description}
                                                </CardDescription>
                                            )}
                                        </div>
                                        {selectedNotes.isFavourite && (
                                            <Badge>★ Favourite</Badge>
                                        )}
                                    </div>
                                    {selectedNotes.createdAt && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Created on{" "}
                                            {formatDate(selectedNotes.createdAt)}
                                        </p>
                                    )}
                                    {selectedNotes.updatedAt && (
                                        <p className="text-xs text-muted-foreground">
                                            Last updated{" "}
                                            {formatDate(selectedNotes.updatedAt)}
                                        </p>
                                    )}
                                    {selectedNotes.videoUrl && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Video URL:{" "}
                                            <a
                                                href={selectedNotes.videoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="underline"
                                            >
                                                {selectedNotes.videoUrl}
                                            </a>
                                        </p>
                                    )}
                                </CardHeader>

                                <CardContent className="space-y-6 text-sm">
                                    {selectedNotes.content && (
                                        <section>
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Full content
                                            </p>
                                            <p className="whitespace-pre-wrap">
                                                {selectedNotes.content}
                                            </p>
                                        </section>
                                    )}

                                    {selectedNotes.summarised_content && (
                                        <section>
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Summary
                                            </p>
                                            <p className="whitespace-pre-wrap text-muted-foreground">
                                                {selectedNotes.summarised_content}
                                            </p>
                                        </section>
                                    )}

                                    <section className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                        {selectedNotes.collection && (
                                            <span>
                                                Collection:{" "}
                                                {selectedNotes.collection.name ||
                                                    selectedNotes.collection}
                                            </span>
                                        )}
                                        {selectedNotes.user && (
                                            <span>
                                                Author:{" "}
                                                {selectedNotes.user.name ||
                                                    selectedNotes.user.email ||
                                                    selectedNotes.user}
                                            </span>
                                        )}
                                    </section>
                                </CardContent>

                                <CardFooter className="flex flex-wrap gap-2">
                                    {selectedNotes.videoUrl && (
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                handleOpenVideo(selectedNotes)
                                            }
                                        >
                                            Watch video
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant={
                                            selectedNotes.isFavourite
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={(e) =>
                                            handleToggleFavourite(
                                                selectedNotes._id,
                                                e
                                            )
                                        }
                                    >
                                        {selectedNotes.isFavourite
                                            ? "Unfavourite"
                                            : "Favourite"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotesDashboard;
