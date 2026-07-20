"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "./ui/dialog";
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    ArrowRight,
    Share2,
    Info,
    Check,
    Globe,
    UserCheck,
    Lock,
    LogIn
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export type BrowseEventItem = {
    eventId: number;
    name: string;
    title: string;
    description?: string;
    imageUrl: string;
    date: string;
    dateTime: string;
    location: string;
    attendees: number;
    isJoined?: boolean;
    rawDate?: number;
    autoOpenDetails?: boolean;
};

export function BrowseEvents({
    eventId,
    name,
    title,
    description,
    imageUrl,
    date,
    attendees,
    dateTime,
    location,
    isJoined = false,
    autoOpenDetails = false,
}: BrowseEventItem) {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const [isDetailsOpen, setIsDetailsOpen] = useState(autoOpenDetails);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRegisterClick = () => {
        if (isJoined) {
            toast.info("You are already registered for this event!");
            return;
        }
        if (!session) {
            toast.error("401 Unauthorized: Please sign in to register for events");
            setIsAuthModalOpen(true);
            return;
        }
        router.push(`/upcoming-events/register-event?eventId=${eventId}`);
    };

    const handleShareClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}/upcoming-events?eventId=${eventId}`;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Event share link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <Card className="group relative flex flex-col justify-between overflow-hidden border border-zinc-200/80 bg-white/70 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10 dark:border-zinc-800/80 dark:bg-zinc-900/40 w-full">
                
                {/* Event poster banner */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <img
                        src={imageUrl || "/placeholder-event.png"}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80";
                        }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-70 group-hover:opacity-80 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 gap-2">
                        <Badge variant="secondary" className="backdrop-blur-md bg-black/50 text-white border border-white/20 shadow-sm text-xs font-medium px-2.5 py-1">
                            <Globe className="size-3 mr-1 text-emerald-400" />
                            <span>Public</span>
                        </Badge>

                        <Badge variant="secondary" className="backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 text-zinc-900 dark:text-zinc-50 border border-white/20 shadow-sm text-xs font-semibold px-2.5 py-1">
                            <Users className="size-3 mr-1 text-primary" />
                            <span>{attendees} {attendees === 1 ? 'Attendee' : 'Attendees'}</span>
                        </Badge>
                    </div>

                    {/* Quick view button overlay */}
                    <button
                        onClick={() => setIsDetailsOpen(true)}
                        className="absolute bottom-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-zinc-900/80 text-zinc-800 dark:text-zinc-200 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-md cursor-pointer"
                        title="View details"
                    >
                        <Info className="size-4" />
                    </button>
                </div>

                {/* Event header content */}
                <CardHeader className="space-y-2 pt-4 pb-2">
                    <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
                            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                            Hosted by {name}
                        </span>
                        {isJoined && (
                            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                                <UserCheck className="size-3 mr-1" />
                                Registered
                            </Badge>
                        )}
                    </div>
                    
                    <CardTitle
                        onClick={() => setIsDetailsOpen(true)}
                        className="line-clamp-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 transition-colors group-hover:text-primary cursor-pointer leading-snug"
                    >
                        {title}
                    </CardTitle>

                    {description && (
                        <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pt-0.5">
                            {description}
                        </p>
                    )}
                </CardHeader>

                {/* Event info specs */}
                <CardContent className="space-y-2.5 py-3 border-t border-dashed border-zinc-200/60 dark:border-zinc-800/60 my-2">
                    <div className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                        <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                            <Calendar className="size-3.5" />
                        </div>
                        <span className="font-semibold">{date}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                        <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                            <Clock className="size-3.5" />
                        </div>
                        <span>{dateTime}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                        <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                            <MapPin className="size-3.5" />
                        </div>
                        <span className="line-clamp-1 font-medium">{location}</span>
                    </div>
                </CardContent>

                {/* Footer action controls */}
                <CardFooter className="pt-2 pb-4 border-t border-zinc-100 dark:border-zinc-800/60 flex gap-2">
                    <Button
                        onClick={(e) => handleShareClick(e)}
                        variant="outline"
                        size="icon"
                        className="shrink-0 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                        title="Share event link"
                    >
                        {copied ? <Check className="size-4 text-emerald-500" /> : <Share2 className="size-4" />}
                    </Button>

                    <Button
                        onClick={handleRegisterClick}
                        disabled={isJoined}
                        variant={isJoined ? "secondary" : "default"}
                        className={`flex-1 cursor-pointer font-semibold shadow-sm transition-all ${
                            isJoined
                                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                        }`}
                    >
                        <span>{isJoined ? "Registered ✓" : "Register Now"}</span>
                        {!isJoined && <ArrowRight className="size-4 ml-1.5 transition-transform group-hover:translate-x-1" />}
                    </Button>
                </CardFooter>
            </Card>

            {/* Event Detail Modal Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-lg p-0 overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                        <img
                            src={imageUrl || "/placeholder-event.png"}
                            alt={title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-5 right-5">
                            <Badge variant="secondary" className="mb-2 bg-primary/20 text-primary border border-primary/30 backdrop-blur-md">
                                Public Event
                            </Badge>
                            <h2 className="text-2xl font-extrabold text-white leading-tight">
                                {title}
                            </h2>
                        </div>
                    </div>

                    <div className="p-6 space-y-5">
                        <DialogHeader>
                            <DialogTitle className="sr-only">{title}</DialogTitle>
                            <DialogDescription className="text-xs text-primary font-semibold uppercase tracking-wider">
                                Hosted by {name}
                            </DialogDescription>
                        </DialogHeader>

                        {description && (
                            <div className="space-y-1.5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">About Event</h4>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                                    {description}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                    <Calendar className="size-3.5 text-primary" />
                                    <span>Date</span>
                                </div>
                                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{date}</p>
                            </div>

                            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                    <Clock className="size-3.5 text-primary" />
                                    <span>Time & Duration</span>
                                </div>
                                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{dateTime}</p>
                            </div>

                            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                    <MapPin className="size-3.5 text-primary" />
                                    <span>Location</span>
                                </div>
                                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{location}</p>
                            </div>

                            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                    <Users className="size-3.5 text-primary" />
                                    <span>Registered</span>
                                </div>
                                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{attendees} people</p>
                            </div>
                        </div>

                        <DialogFooter className="pt-3 gap-2 sm:gap-2">
                            <Button
                                onClick={(e) => handleShareClick(e)}
                                variant="outline"
                                className="w-full sm:w-auto cursor-pointer"
                            >
                                <Share2 className="size-4 mr-2" />
                                {copied ? "Copied!" : "Share Event"}
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsDetailsOpen(false);
                                    handleRegisterClick();
                                }}
                                disabled={isJoined}
                                className="w-full sm:w-1 flex-1 cursor-pointer font-bold"
                            >
                                {isJoined ? "Already Registered ✓" : "Register Now"}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 401 Unauthenticated Modal Dialog */}
            <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
                <DialogContent className="max-w-md p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-center space-y-4">
                    <div className="mx-auto size-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                        <Lock className="size-7" />
                    </div>
                    
                    <DialogHeader className="space-y-1 text-center">
                        <DialogTitle className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                            Authentication Required
                        </DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            You are not signed in. You must log in to your account to register for <span className="font-semibold text-zinc-800 dark:text-zinc-200">"{title}"</span> and receive ticket confirmations.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 text-xs font-semibold">
                        Unauthenticated Guest
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsAuthModalOpen(false)}
                            className="w-full sm:flex-1 rounded-xl cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                setIsAuthModalOpen(false);
                                const targetUrl = `/upcoming-events/register-event?eventId=${eventId}`;
                                router.push(`/sign-in?callbackUrl=${encodeURIComponent(targetUrl)}`);
                            }}
                            className="w-full sm:flex-1 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                        >
                            <LogIn className="size-4 mr-1.5" />
                            Sign In Now
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}