"use client"

import { useState } from "react";
import { useImageKitUpload } from "@/hooks/use-imagekit-upload";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@base-ui/react";
import { toast } from "sonner";
import axios from "axios";

interface FormInput {
    title: string;
    date: string;
    isPrivate: boolean;
    startTime: string;
    duration: string;
    location: string;
    description: string;
    poster: string;
}

export interface CreateEventFormProps {
    initialData?: {
        id?: number | string;
        title: string;
        date: string;
        startTime: string;
        duration: string;
        location: string;
        description: string;
        poster: string;
        isPrivate?: boolean;
    };
    onSuccess?: () => void;
}

export function EventForm({ initialData, onSuccess }: CreateEventFormProps = {}) {
    const [values, setValue] = useState<FormInput>({
        title: initialData?.title || "",
        date: initialData?.date || "",
        startTime: initialData?.startTime || "",
        duration: initialData?.duration || "",
        isPrivate: initialData?.isPrivate || false,
        location: initialData?.location || "",
        description: initialData?.description || "",
        poster: initialData?.poster || "",
    })
    const [errors, setErrors] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false);
    const { uploadFile, progress, isUploading, uploadedUrl } = useImageKitUpload();

    const isEditMode = Boolean(initialData?.id);

    const handleFileChange = async (files: File[]) => {
        if (files.length === 0) return;
        const url = await uploadFile(files[0]);
        if (url) {
            setValue((prev) => ({ ...prev, poster: url }));
            toast.success("Poster uploaded successfully");
        } else {
            toast.error("Failed to upload poster");
        }
    }

    const handleSubmit = async () => {
        if (!values.title || !values.date || !values.startTime || !values.duration || !values.location || !values.description) {
            toast.error("Please fill in all the fields");
            return;
        }
        if (!values.poster) {
            toast.error("Please upload a poster first");
            return;
        }

        const dateParts = values.date.split("-");
        const timeParts = values.startTime.split(":");

        const dateObj = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
        const epochDate = Math.floor(dateObj.getTime() / 1000);

        const startObj = new Date(
            Number(dateParts[0]),
            Number(dateParts[1]) - 1,
            Number(dateParts[2]),
            Number(timeParts[0]),
            Number(timeParts[1])
        );
        const epochStartTime = Math.floor(startObj.getTime() / 1000);
        const durationNum = Number(values.duration);

        if (isNaN(epochDate) || isNaN(epochStartTime) || isNaN(durationNum)) {
            toast.error("Invalid date, time, or duration input values");
            return;
        }

        setIsSubmitting(true)
        setErrors(false)
        try {
            const payload = {
                id: initialData?.id,
                title: values.title,
                description: values.description,
                date: epochDate,
                startTime: epochStartTime,
                duration: durationNum,
                posterUrl: values.poster,
                location: values.location,
                isPrivate: values.isPrivate,
            };

            const response = isEditMode
                ? await axios.patch("/api/events", payload)
                : await axios.post("/api/events", payload);

            if (response.status === 200) {
                toast.success(isEditMode ? "Event updated successfully" : "Event created successfully");
                if (!isEditMode) {
                    setValue({
                        title: "",
                        date: "",
                        startTime: "",
                        duration: "",
                        isPrivate: false,
                        location: "",
                        description: "",
                        poster: "",
                    });
                }
                onSuccess?.();
            } else {
                toast.error(isEditMode ? "Failed to update event" : "Failed to create event")
            }
        } catch (error) {
            console.error(error)
            setErrors(true)
            toast.error(isEditMode ? "Failed to update event" : "Failed to create event")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!initialData?.id) return;
        if (!confirm("Are you sure you want to delete this event?")) return;

        setIsDeleting(true);
        try {
            const response = await axios.delete("/api/events", {
                data: { id: initialData.id },
            });
            if (response.status === 200) {
                toast.success("Event deleted successfully");
                onSuccess?.();
            } else {
                toast.error("Failed to delete event");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete event");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col w-full mx-auto my-auto p-2 gap-5">
            <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Event Title</label>
                    <Input
                        placeholder="Event Title"
                        value={values.title}
                        onChange={(e) => setValue({ ...values, title: e.target.value })}
                        className="flex h-11 w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 dark:border-zinc-800/80 dark:bg-zinc-950 dark:placeholder:text-zinc-600 transition-all duration-200"
                        required
                    />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Event Date</label>
                    <Input
                        type="date"
                        placeholder="Event Date"
                        value={values.date}
                        onChange={(e) => setValue({ ...values, date: e.target.value })}
                        className="flex h-11 w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 dark:border-zinc-800/80 dark:bg-zinc-950 dark:placeholder:text-zinc-600 transition-all duration-200"
                        required
                    />
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Start Time</label>
                    <Input
                        type="time"
                        placeholder="Start Time"
                        value={values.startTime}
                        onChange={(e) => setValue({ ...values, startTime: e.target.value })}
                        className="flex h-11 w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 dark:border-zinc-800/80 dark:bg-zinc-950 dark:placeholder:text-zinc-600 transition-all duration-200"
                        required
                    />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Duration (in minutes)</label>
                    <Input
                        type="number"
                        placeholder="Duration (in minutes)"
                        value={values.duration}
                        onChange={(e) => setValue({ ...values, duration: e.target.value })}
                        className="flex h-11 w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 dark:border-zinc-800/80 dark:bg-zinc-950 dark:placeholder:text-zinc-600 transition-all duration-200"
                        required
                    />
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Location</label>
                    <Input
                        placeholder="Location"
                        value={values.location}
                        onChange={(e) => setValue({ ...values, location: e.target.value })}
                        className="flex h-11 w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 dark:border-zinc-800/80 dark:bg-zinc-950 dark:placeholder:text-zinc-600 transition-all duration-200"
                        required
                    />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Description</label>
                    <Input
                        placeholder="Description"
                        value={values.description}
                        onChange={(e) => setValue({ ...values, description: e.target.value })}
                        className="flex h-11 w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 dark:border-zinc-800/80 dark:bg-zinc-950 dark:placeholder:text-zinc-600 transition-all duration-200"
                        required
                    />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Event Poster</label>
                <div className="w-full border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-950/20 overflow-hidden">
                    <FileUpload onChange={handleFileChange} />
                    {isUploading && (
                        <div className="px-6 pb-6">
                            <div className="flex justify-between text-xs text-neutral-500 mb-2">
                                <span>Uploading poster...</span>
                                <span className="font-semibold">{Math.round(progress)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-pink-500 to-violet-500 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                    {values.poster && !isUploading && (
                        <div className="px-6 pb-6 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                            <span className="flex items-center justify-center size-5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-xs font-bold">✓</span>
                            <span>Poster uploaded successfully</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-3 mt-2">
                {isEditMode && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isSubmitting || isUploading || isDeleting}
                        className="flex-1 rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-600 shadow-sm hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50 disabled:opacity-50 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <span className="size-4 animate-spin rounded-full border-2 border-rose-600 border-t-transparent dark:border-rose-400" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <span>Delete Event</span>
                        )}
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || isUploading || isDeleting}
                    className={`${isEditMode ? "flex-1" : "w-full"} rounded-full bg-gradient-to-r from-pink-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:from-pink-500 hover:to-violet-500 disabled:opacity-50 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2`}
                >
                    {isSubmitting ? (
                        <>
                            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>{isEditMode ? "Updating Event..." : "Creating Event..."}</span>
                        </>
                    ) : (
                        <span>{isEditMode ? "Update Event" : "Create Event"}</span>
                    )}
                </button>
            </div>
        </div>
    )
}