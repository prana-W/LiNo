import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Star } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

const NoteDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const api = useApi();

    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchNoteDetails();
    }, [id]);

    const fetchNoteDetails = async () => {
        if (!id) {
            navigate("/notes");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await api.get(`/notes/${id}`);
            const payload = res.data;
            const noteData = payload.data || payload.notes || payload;

            setNote(noteData);
        } catch (err) {
            console.error(err);
            setError(
                err?.response?.data?.message ||
                "Failed to load note details. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavourite = async () => {
        if (!note) return;

        // Optimistic update
        setNote((prev) => ({
            ...prev,
            isFavourite: !prev.isFavourite,
        }));

        try {
            await api.post("/notes/toggle-favourite", { notesId: note._id });
        } catch (err) {
            console.error(err);
            // Revert on error
            setNote((prev) => ({
                ...prev,
                isFavourite: !prev.isFavourite,
            }));
        }
    };

    const handleOpenVideo = () => {
        if (!note?.videoUrl) return;
        window.open(note.videoUrl, "_blank", "noopener,noreferrer");
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <div className="mx-auto max-w-4xl px-4 py-8">
                    <Skeleton className="mb-6 h-8 w-32" />
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="mt-2 h-4 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                            <Skeleton className="mt-6 h-32 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <div className="mx-auto max-w-4xl px-4 py-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/notes")}
                        className="mb-6"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Notes
                    </Button>
                    <div className="rounded-lg border border-destructive bg-destructive/10 px-6 py-4">
                        <p className="font-semibold text-destructive">{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchNoteDetails}
                            className="mt-3"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <div className="mx-auto max-w-4xl px-4 py-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/notes")}
                        className="mb-6"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Notes
                    </Button>
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
                        <p className="text-lg font-medium">Note not found</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            This note may have been deleted or doesn't exist.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-4xl px-4 py-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/notes")}
                    className="mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Notes
                </Button>

                {/* Note Details Card */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <CardTitle className="text-2xl">
                                        {note.name || "Untitled Notes"}
                                    </CardTitle>
                                    {note.isFavourite && (
                                        <Badge variant="default">
                                            <Star className="h-3 w-3 mr-1 fill-current" />
                                            Favourite
                                        </Badge>
                                    )}
                                </div>
                                {note.description && (
                                    <CardDescription className="text-base">
                                        {note.description}
                                    </CardDescription>
                                )}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {note.createdAt && (
                                <div>
                                    <span className="font-medium">Created:</span>{" "}
                                    {formatDate(note.createdAt)}
                                </div>
                            )}
                            {note.updatedAt && note.updatedAt !== note.createdAt && (
                                <div>
                                    <span className="font-medium">Updated:</span>{" "}
                                    {formatDate(note.updatedAt)}
                                </div>
                            )}
                        </div>

                        {/* Collection & Author */}
                        <div className="mt-3 flex flex-wrap gap-3">
                            {note.collection && (
                                <Badge variant="outline">
                                    Collection:{" "}
                                    {note.collection.name || note.collection}
                                </Badge>
                            )}
                            {note.user && (
                                <Badge variant="outline">
                                    Author:{" "}
                                    {note.user.name ||
                                        note.user.email ||
                                        note.user}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Video URL */}
                        {note.videoUrl && (
                            <div>
                                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    Video Source
                                </p>
                                <a
                                    href={note.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    {note.videoUrl}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        )}

                        <Separator />

                        {/* Summary */}
                        {note.summarised_content && (
                            <div>
                                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    Summary
                                </p>
                                <div className="rounded-lg bg-muted/60 p-4">
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                        {note.summarised_content}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Full Content */}
                        {note.content && (
                            <div>
                                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    Full Content
                                </p>
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap leading-relaxed">
                                        {note.content}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!note.content && !note.summarised_content && (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                                <p className="text-sm text-muted-foreground">
                                    No content available for this note yet.
                                </p>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-wrap gap-3">
                        {note.videoUrl && (
                            <Button onClick={handleOpenVideo}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Watch Video
                            </Button>
                        )}
                        <Button
                            variant={note.isFavourite ? "default" : "outline"}
                            onClick={handleToggleFavourite}
                        >
                            <Star
                                className={`mr-2 h-4 w-4 ${
                                    note.isFavourite ? "fill-current" : ""
                                }`}
                            />
                            {note.isFavourite ? "Unfavourite" : "Mark as Favourite"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default NoteDetailsPage;