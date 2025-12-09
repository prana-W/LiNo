import { useEffect, useState } from "react";
import api from "@/services/api.js";

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

function LectureSkeletonCard() {
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

const LectureDashboard = () => {
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // details state
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");

    // Fetch all lectures
    const fetchLectures = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await api.get("/lectures");

            // backend: { data: [...] } or { data: { lectures: [...] } }
            const data = res.data.data;
            const list = Array.isArray(data) ? data : data.lectures || [];
            setLectures(list);
        } catch (err) {
            console.error(err);
            setError(
                err?.response?.data?.message || "Failed to load lectures. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLectures();
    }, []);

    const handleOpenVideo = (lecture, e) => {
        // avoid triggering card click
        if (e) e.stopPropagation();
        if (!lecture?.videoUrl) return;
        window.open(lecture.videoUrl, "_blank", "noopener,noreferrer");
    };

    const handleToggleFavourite = async (lectureId, e) => {
        // avoid triggering card click
        if (e) e.stopPropagation();

        // Optimistic update
        setLectures((prev) =>
            prev.map((lec) =>
                lec._id === lectureId
                    ? { ...lec, isFavourite: !lec.isFavourite }
                    : lec
            )
        );

        try {
            await api.post("/lectures/toggle-favourite", { lectureId });
        } catch (err) {
            console.error(err);
            // Revert on error
            setLectures((prev) =>
                prev.map((lec) =>
                    lec._id === lectureId
                        ? { ...lec, isFavourite: !lec.isFavourite }
                        : lec
                )
            );
        }
    };

    const fetchLectureDetails = async (lectureId) => {
        if (!lectureId) return;
        try {
            setDetailLoading(true);
            setDetailError("");

            const res = await api.get(`/lectures/${lectureId}`);

            // backend could respond as { data: lecture } or { lecture } or lecture itself
            const payload = res.data;
            const lecture =
                payload.data || payload.lecture || payload;

            setSelectedLecture(lecture);
        } catch (err) {
            console.error(err);
            setDetailError(
                err?.response?.data?.message ||
                "Failed to load lecture details. Please try again."
            );
        } finally {
            setDetailLoading(false);
        }
    };

    const handleSelectLecture = (lectureId) => {
        fetchLectureDetails(lectureId);
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
                            Lectures Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            All your lectures in one place. Click a lecture to view full
                            details, or watch and mark favourites.
                        </p>
                    </div>

                    <Button variant="outline" size="sm" onClick={fetchLectures}>
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
                            <LectureSkeletonCard key={idx} />
                        ))}
                    </div>
                ) : lectures.length === 0 ? (
                    // Empty state
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
                        <p className="text-lg font-medium">No lectures found</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Once you add lectures from the backend, they will appear here.
                        </p>
                    </div>
                ) : (
                    // Lectures grid
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {lectures.map((lecture) => (
                            <Card
                                key={lecture._id}
                                className="flex cursor-pointer flex-col justify-between transition hover:shadow-md"
                                onClick={() => handleSelectLecture(lecture._id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSelectLecture(lecture._id);
                                    }
                                }}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <CardTitle className="line-clamp-1">
                                                {lecture.name || "Untitled Lecture"}
                                            </CardTitle>
                                            <CardDescription className="mt-1 text-xs">
                                                {lecture.playlist?.name
                                                    ? `Playlist: ${lecture.playlist.name}`
                                                    : lecture.playlist
                                                        ? `Playlist: ${lecture.playlist}`
                                                        : "No playlist"}
                                            </CardDescription>
                                        </div>
                                        {lecture.isFavourite && (
                                            <Badge variant="default" className="shrink-0">
                                                ★ Favourite
                                            </Badge>
                                        )}
                                    </div>
                                    {lecture.createdAt && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Added on {formatDate(lecture.createdAt)}
                                        </p>
                                    )}
                                </CardHeader>

                                <CardContent className="space-y-2 text-sm">
                                    {lecture.description && (
                                        <p className="line-clamp-2 text-muted-foreground">
                                            {lecture.description}
                                        </p>
                                    )}

                                    {lecture.summarised_content && (
                                        <div className="mt-2 rounded-md bg-muted/60 p-2 text-xs">
                                            <p className="font-medium">Summary</p>
                                            <p className="mt-1 line-clamp-3 text-muted-foreground">
                                                {lecture.summarised_content}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="flex items-center justify-between gap-2">
                                    <Button
                                        size="sm"
                                        className="flex-1"
                                        onClick={(e) => handleOpenVideo(lecture, e)}
                                        disabled={!lecture.videoUrl}
                                    >
                                        Watch video
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant={lecture.isFavourite ? "default" : "outline"}
                                        onClick={(e) =>
                                            handleToggleFavourite(lecture._id, e)
                                        }
                                    >
                                        {lecture.isFavourite ? "Unfavourite" : "Favourite"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Selected lecture details */}
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

                    {selectedLecture && !detailLoading && (
                        <div>
                            <h2 className="mb-3 text-xl font-semibold tracking-tight">
                                Lecture details
                            </h2>
                            <Card className="border">
                                <CardHeader>
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <CardTitle>
                                                {selectedLecture.name || "Untitled Lecture"}
                                            </CardTitle>
                                            {selectedLecture.description && (
                                                <CardDescription className="mt-1">
                                                    {selectedLecture.description}
                                                </CardDescription>
                                            )}
                                        </div>
                                        {selectedLecture.isFavourite && (
                                            <Badge>★ Favourite</Badge>
                                        )}
                                    </div>
                                    {selectedLecture.createdAt && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Created on{" "}
                                            {formatDate(selectedLecture.createdAt)}
                                        </p>
                                    )}
                                    {selectedLecture.updatedAt && (
                                        <p className="text-xs text-muted-foreground">
                                            Last updated{" "}
                                            {formatDate(selectedLecture.updatedAt)}
                                        </p>
                                    )}
                                    {selectedLecture.videoUrl && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Video URL:{" "}
                                            <a
                                                href={selectedLecture.videoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="underline"
                                            >
                                                {selectedLecture.videoUrl}
                                            </a>
                                        </p>
                                    )}
                                </CardHeader>

                                <CardContent className="space-y-6 text-sm">
                                    {selectedLecture.content && (
                                        <section>
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Full content
                                            </p>
                                            <p className="whitespace-pre-wrap">
                                                {selectedLecture.content}
                                            </p>
                                        </section>
                                    )}

                                    {selectedLecture.summarised_content && (
                                        <section>
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Summary
                                            </p>
                                            <p className="whitespace-pre-wrap text-muted-foreground">
                                                {selectedLecture.summarised_content}
                                            </p>
                                        </section>
                                    )}

                                    <section className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                        {selectedLecture.playlist && (
                                            <span>
                                                Playlist:{" "}
                                                {selectedLecture.playlist.name ||
                                                    selectedLecture.playlist}
                                            </span>
                                        )}
                                        {selectedLecture.user && (
                                            <span>
                                                Author:{" "}
                                                {selectedLecture.user.name ||
                                                    selectedLecture.user.email ||
                                                    selectedLecture.user}
                                            </span>
                                        )}
                                    </section>
                                </CardContent>

                                <CardFooter className="flex flex-wrap gap-2">
                                    {selectedLecture.videoUrl && (
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                handleOpenVideo(selectedLecture)
                                            }
                                        >
                                            Watch video
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant={
                                            selectedLecture.isFavourite
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={(e) =>
                                            handleToggleFavourite(
                                                selectedLecture._id,
                                                e
                                            )
                                        }
                                    >
                                        {selectedLecture.isFavourite
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

export default LectureDashboard;
