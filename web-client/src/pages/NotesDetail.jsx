import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Star, Save, Lock, Unlock } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const formatTimestamp = (seconds = 0) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
};

const NoteDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const api = useApi();

    const [note, setNote] = useState(null);
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [readOnly, setReadOnly] = useState(true);

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
            toast.error(err?.message);
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
            toast.success("Notes saved");
            setReadOnly(true);
        } catch {
            toast.error("Failed to save changes");
        }
    };

    const handleDeleteImage = async (contentId) => {
        try {
            await api.post("/notes/content/delete", { contentId });
            setContents((prev) => prev.filter((c) => c._id !== contentId));
            toast.success("Image deleted");
        } catch {
            toast.error("Failed to delete image");
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl p-8">
                <Skeleton className="h-8 w-1/2 mb-6" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" onClick={() => navigate("/notes")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            {readOnly ? <Lock size={16} /> : <Unlock size={16} />}
                            Read only
                            <Switch checked={!readOnly} onCheckedChange={() => setReadOnly(!readOnly)} />
                        </div>

                        {!readOnly && (
                            <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" /> Save
                            </Button>
                        )}
                    </div>
                </div>

                {/* Note Meta */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{note.name}</CardTitle>
                        {note.description && (
                            <CardDescription>{note.description}</CardDescription>
                        )}
                    </CardHeader>

                    <CardContent>
                        <Separator className="my-6" />

                        {/* Document Area */}
                        <div className="space-y-6">
                            {contents.map((block) => (
                                <div key={block._id} className="grid grid-cols-[80px_1fr] gap-4">
                                    {/* Timestamp */}
                                    <div className="text-xs text-muted-foreground pt-2 text-right">
                                        {formatTimestamp(block.timestamp)}
                                    </div>

                                    {/* Content */}
                                    {block.type === "text" ? (
                                        <div
                                            contentEditable={!readOnly}
                                            suppressContentEditableWarning
                                            className={`prose prose-neutral max-w-none outline-none ${
                                                !readOnly ? "border-b border-dashed pb-1" : ""
                                            }`}
                                            onBlur={(e) => {
                                                if (readOnly) return;
                                                setContents((prev) =>
                                                    prev.map((c) =>
                                                        c._id === block._id
                                                            ? { ...c, value: e.target.innerText }
                                                            : c
                                                    )
                                                );
                                            }}
                                        >
                                            {block.value}
                                        </div>
                                    ) : (
                                        <div
                                            className="flex justify-center"
                                            onContextMenu={(e) => {
                                                if (readOnly) return;
                                                e.preventDefault();

                                                const action = window.prompt(
                                                    "Type 'delete' to remove or 'download' to save image"
                                                );

                                                if (action === "delete") {
                                                    handleDeleteImage(block._id);
                                                }

                                                if (action === "download") {
                                                    const a = document.createElement("a");
                                                    a.href = block.value;
                                                    a.download = "note-image";
                                                    a.click();
                                                }
                                            }}
                                        >
                                            <img
                                                src={`${import.meta.env.VITE_BASE_URL}/${block.value}`}
                                                alt="Note"
                                                className="max-w-[600px] rounded-md border"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NoteDetailsPage;
