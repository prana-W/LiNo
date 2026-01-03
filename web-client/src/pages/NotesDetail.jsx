import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ExternalLink,
    Star,
    Save,
    Lock,
    Unlock,
    Download,
    Trash2,
    Share2,
    FileDown,
} from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const formatTimestamp = (seconds = 0) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
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

const getYoutubeEmbedUrl = (url, start = -1) => {
    if (!url) return "";

    const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
    );

    if (!match) return "";

    if(start !== -1) return `https://www.youtube.com/embed/${match[1]}?start=${start}&autoplay=1&rel=0&modestbranding=1&playsinline=1&fs=1`;

    return `https://www.youtube.com/embed/${match[1]}?&rel=0&modestbranding=1&playsinline=1&fs=1`;
};

const NoteDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const api = useApi();

    const [note, setNote] = useState(null);
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [readOnly, setReadOnly] = useState(true);
    const [hoveredImage, setHoveredImage] = useState(null);
    const [videoTime, setVideoTime] = useState(-1);
    const iframeRef = useRef(null);
    const videoSectionRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);


    useEffect(() => {
        fetchAll();
    }, [id]);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const noteRes = await api.get(`/notes/${id}`);
            const contentRes = await api.get(`/notes/content/${id}`);

            setNote(noteRes.data);
            setContents(contentRes.data);
        } catch (err) {
            toast.error(err?.message || "Failed to load note");
            navigate("/notes");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await api.post("/notes/content/edit", {
                notesId: id,
                contents,
            });
            toast.success("Notes saved successfully");
            setReadOnly(true);
            // Refresh page after successful save
            window.location.reload();
        } catch {
            toast.error("Failed to save changes");
        }
    };

    const handleDeleteImage = async (contentId) => {
        if (readOnly) {
            toast.error("Enable editing mode to delete images");
            return;
        }

        try {
            await api.post("/notes/content/delete", { contentId });
            setContents((prev) => prev.filter((c) => c._id !== contentId));
            toast.success("Image deleted successfully");
            // Refresh page after successful delete
            window.location.reload();
        } catch {
            toast.error("Failed to delete image");
        }
    };

    const handleDownloadImage = (imageUrl) => {
        const fullUrl = `${import.meta.env.VITE_BASE_URL}/${imageUrl}`;
        const a = document.createElement("a");
        a.href = fullUrl;
        a.download = `note-image-${Date.now()}`;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("Image download started");
    };

    const handleToggleFavourite = async () => {
        if (!note) return;

        setNote((prev) => ({
            ...prev,
            isFavourite: !prev.isFavourite,
        }));

        try {
            await api.post("/notes/toggle-favourite", { notesId: note._id });
            toast.success(
                note.isFavourite
                    ? "Removed from favourites"
                    : "Added to favourites"
            );
        } catch (err) {
            console.error(err);
            setNote((prev) => ({
                ...prev,
                isFavourite: !prev.isFavourite,
            }));
            toast.error("Failed to update favourite status");
        }
    };

    const handleOpenVideo = () => {
        if (!note?.videoUrl) return;
        window.open(note.videoUrl, "_blank", "noopener,noreferrer");
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: note.name || "Note",
                    text: note.description || "Check out this note",
                    url: shareUrl,
                });
                toast.success("Shared successfully");
            } catch (err) {
                if (err.name !== "AbortError") {
                    handleCopyLink(shareUrl);
                }
            }
        } else {
            handleCopyLink(shareUrl);
        }
    };

    const handleCopyLink = (url) => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
    };

    const exportToPDF = () => {
        toast.info("PDF export coming soon");
        // Implementation would use libraries like jsPDF or html2pdf
    };

    const exportToMarkdown = () => {
        let markdown = `# ${note.name || "Untitled Note"}\n\n`;

        if (note.description) {
            markdown += `${note.description}\n\n`;
        }

        if (note.createdAt) {
            markdown += `**Created:** ${formatDate(note.createdAt)}\n`;
        }

        if (note.videoUrl) {
            markdown += `**Video:** [Watch Video](${note.videoUrl})\n`;
        }

        markdown += `\n---\n\n`;

        contents.forEach((block) => {
            if (block.type === "text") {
                markdown += `**[${formatTimestamp(block.timestamp)}]** ${block.value}\n\n`;
            } else {
                markdown += `**[${formatTimestamp(block.timestamp)}]** ![Image](${import.meta.env.VITE_BASE_URL}/${block.value})\n\n`;
            }
        });

        const blob = new Blob([markdown], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${note.name || "note"}.md`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Markdown exported successfully");
    };

    const exportToDocx = () => {
        toast.info("DOCX export coming soon");
        // Implementation would use libraries like docx.js
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl p-8">
                <Skeleton className="h-8 w-1/2 mb-6" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!note) {
        return (
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-4xl px-4 py-8">
                    <Button variant="ghost" onClick={() => navigate("/notes")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Notes
                    </Button>
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center mt-6">
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
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <Button variant="ghost" onClick={() => navigate("/notes")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Export Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={exportToPDF}>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={exportToMarkdown}>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Export as Markdown
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={exportToDocx}>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Export as DOCX
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Share Button */}
                        <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                        </Button>

                        {/* Read-only Toggle */}
                        <div className="flex items-center gap-2 text-sm border rounded-md px-3 py-2">
                            {readOnly ? (
                                <Lock size={16} className="text-muted-foreground" />
                            ) : (
                                <Unlock size={16} className="text-primary" />
                            )}
                            <span className="text-muted-foreground">Read only</span>
                            <Switch
                                checked={readOnly}
                                onCheckedChange={() => setReadOnly(!readOnly)}
                            />
                        </div>

                        {/* Save Button */}
                        {!readOnly && (
                            <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" /> Save
                            </Button>
                        )}
                    </div>
                </div>

                {/* Note Meta Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <CardTitle className="text-2xl">
                                        {note.name || "Untitled Note"}
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

                        {/* Metadata Grid */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            {note.createdAt && (
                                <div className="flex flex-col">
                                    <span className="text-muted-foreground font-medium">
                                        Created
                                    </span>
                                    <span>{formatDate(note.createdAt)}</span>
                                </div>
                            )}
                            {note.updatedAt && note.updatedAt !== note.createdAt && (
                                <div className="flex flex-col">
                                    <span className="text-muted-foreground font-medium">
                                        Last Updated
                                    </span>
                                    <span>{formatDate(note.updatedAt)}</span>
                                </div>
                            )}
                            {note.collection && (
                                <div className="flex flex-col">
                                    <span className="text-muted-foreground font-medium">
                                        Collection
                                    </span>
                                    <span>
                                        {note.collection.name || note.collection}
                                    </span>
                                </div>
                            )}
                            {note.user && (
                                <div className="flex flex-col">
                                    <span className="text-muted-foreground font-medium">
                                        Author
                                    </span>
                                    <span>
                                        {note.user.name ||
                                            note.user.email ||
                                            note.user}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Video URL */}
                        {note.videoUrl && (
                            <div className="mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleOpenVideo}
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Watch Source Video
                                </Button>
                            </div>
                        )}





                        {note.videoUrl && (
                            <div
                                ref={videoSectionRef}
                                className="mt-6 aspect-video w-full overflow-hidden rounded-lg border scroll-mt-24"
                            >
                            <iframe
                                    ref={iframeRef}
                                    title="YouTube Player"
                                    className="h-full w-full"
                                    src={getYoutubeEmbedUrl(note.videoUrl, videoTime)}
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            </div>
                        )}

                    </CardHeader>
                </Card>

                {/* Content Card */}
                <Card>
                    <CardContent className="pt-6">
                        {contents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
                                <p className="text-sm text-muted-foreground">
                                    No content available for this note yet.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {contents.map((block) => (
                                    <div
                                        key={block._id}
                                        className="grid grid-cols-[80px_1fr] gap-4"
                                    >
                                        {/* Timestamp */}
                                        <button
                                            className="text-xs text-muted-foreground pt-2 text-right font-mono hover:text-primary transition"
                                            onClick={() => {
                                                setVideoTime(block.timestamp);

                                                videoSectionRef.current?.scrollIntoView({
                                                    behavior: "smooth",
                                                    block: "start",
                                                });
                                            }}

                                        >
                                            {formatTimestamp(block.timestamp)}
                                        </button>


                                        {/* Content */}
                                        {block.type === "text" ? (
                                            <div
                                                contentEditable={!readOnly}
                                                suppressContentEditableWarning
                                                className={`prose prose-neutral dark:prose-invert max-w-none outline-none ${
                                                    !readOnly
                                                        ? "border-b border-dashed pb-1 focus:border-primary"
                                                        : ""
                                                } ${readOnly ? "cursor-default" : "cursor-text"}`}
                                                onBlur={(e) => {
                                                    if (readOnly) return;
                                                    setContents((prev) =>
                                                        prev.map((c) =>
                                                            c._id === block._id
                                                                ? {
                                                                    ...c,
                                                                    value: e.target
                                                                        .innerText,
                                                                }
                                                                : c
                                                        )
                                                    );
                                                }}
                                            >
                                                {block.value}
                                            </div>
                                        ) : (
                                            <div
                                                className="relative inline-block"
                                                onMouseEnter={() =>
                                                    setHoveredImage(block._id)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredImage(null)
                                                }
                                            >
                                                <img
                                                    src={`${import.meta.env.VITE_BASE_URL}/${block.value}`}
                                                    alt="Note content"
                                                    className="max-w-full sm:max-w-[600px] rounded-md border cursor-zoom-in"
                                                    onClick={() =>
                                                        setPreviewImage(`${import.meta.env.VITE_BASE_URL}/${block.value}`)
                                                    }
                                                />


                                                {/* Image Action Menu */}
                                                {hoveredImage === block._id && (
                                                    <div className="absolute top-2 right-2 flex gap-2 bg-background/95 backdrop-blur-sm border rounded-md shadow-lg p-1">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                handleDownloadImage(
                                                                    block.value
                                                                )
                                                            }
                                                        >
                                                            <Download className="h-4 w-4 mr-1" />
                                                            Download
                                                        </Button>
                                                        {!readOnly && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() =>
                                                                    handleDeleteImage(
                                                                        block._id
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                Delete
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-wrap gap-3">
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
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setPreviewImage(null)}
                >
                    <img
                        src={previewImage}
                        alt="Full view"
                        className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-xl cursor-zoom-out"
                    />

                </div>
            )}
        </div>
    );
};

export default NoteDetailsPage;