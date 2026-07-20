"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { BrowseEvents, BrowseEventItem } from "./browse-events";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
    Search,
    MapPin,
    X,
    Calendar,
    ArrowUpDown,
    Frown
} from "lucide-react";

type ExploreEventsClientProps = {
    initialEvents: BrowseEventItem[];
};

export function ExploreEventsClient({ initialEvents }: ExploreEventsClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialQ = searchParams.get("q") || "";
    const initialCity = searchParams.get("city") || "ALL";
    const initialDate = (searchParams.get("date") as "ALL" | "TODAY" | "UPCOMING") || "ALL";
    const initialSort = (searchParams.get("sort") as "SOONEST" | "NEWEST" | "POPULAR") || "SOONEST";

    const [searchQuery, setSearchQuery] = useState(initialQ);
    const [selectedCity, setSelectedCity] = useState<string>(initialCity);
    const [dateFilter, setDateFilter] = useState<"ALL" | "TODAY" | "UPCOMING">(initialDate);
    const [sortBy, setSortBy] = useState<"SOONEST" | "NEWEST" | "POPULAR">(initialSort);

    useEffect(() => {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("q", searchQuery.trim());
        if (selectedCity !== "ALL") params.set("city", selectedCity);
        if (dateFilter !== "ALL") params.set("date", dateFilter);
        if (sortBy !== "SOONEST") params.set("sort", sortBy);

        const queryString = params.toString();
        const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.replace(targetUrl, { scroll: false });
    }, [searchQuery, selectedCity, dateFilter, sortBy, pathname, router]);

    const cities = useMemo(() => {
        const set = new Set<string>();
        initialEvents.forEach((item) => {
            if (item.location) {
                const trimmed = item.location.trim();
                if (trimmed) set.add(trimmed);
            }
        });
        return Array.from(set).sort();
    }, [initialEvents]);

    const filteredEvents = useMemo(() => {
        const nowSec = Math.floor(Date.now() / 1000);

        return initialEvents
            .filter((item) => {
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase().trim();
                    const matchTitle = item.title.toLowerCase().includes(q);
                    const matchDesc = item.description?.toLowerCase().includes(q) || false;
                    const matchLoc = item.location.toLowerCase().includes(q);
                    const matchHost = item.name.toLowerCase().includes(q);
                    if (!matchTitle && !matchDesc && !matchLoc && !matchHost) {
                        return false;
                    }
                }

                if (selectedCity !== "ALL") {
                    if (item.location.toLowerCase() !== selectedCity.toLowerCase()) {
                        return false;
                    }
                }

                if (dateFilter === "UPCOMING" && item.rawDate) {
                    if (item.rawDate < nowSec - 86400) return false;
                } else if (dateFilter === "TODAY" && item.rawDate) {
                    const eventDate = new Date(item.rawDate * 1000).toDateString();
                    const todayDate = new Date().toDateString();
                    if (eventDate !== todayDate) return false;
                }

                return true;
            })
            .sort((a, b) => {
                if (sortBy === "SOONEST") {
                    return (a.rawDate || 0) - (b.rawDate || 0);
                } else if (sortBy === "NEWEST") {
                    return (b.rawDate || 0) - (a.rawDate || 0);
                } else if (sortBy === "POPULAR") {
                    return b.attendees - a.attendees;
                }
                return 0;
            });
    }, [initialEvents, searchQuery, selectedCity, dateFilter, sortBy]);

    const isFiltered = searchQuery.trim() !== "" || selectedCity !== "ALL" || dateFilter !== "ALL";

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCity("ALL");
        setDateFilter("ALL");
        setSortBy("SOONEST");
    };

    return (
        <div className="space-y-8">
            <div className="rounded-3xl border border-zinc-200/80 bg-white/80 dark:border-zinc-800/80 dark:bg-zinc-900/60 p-4 sm:p-6 shadow-lg backdrop-blur-md space-y-4">
                
                <div className="flex flex-col lg:flex-row gap-3">
                    
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                        <Input
                            type="text"
                            placeholder="Search by event title, location, description, or host..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-10 h-11 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-sm focus-visible:ring-primary"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                        <div className="relative min-w-[150px] flex-1 sm:flex-initial">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary" />
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full h-11 pl-9 pr-8 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                            >
                                <option value="ALL">All Cities ({cities.length})</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="relative min-w-[150px] flex-1 sm:flex-initial">
                            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full h-11 pl-9 pr-8 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                            >
                                <option value="SOONEST">Sort: Soonest</option>
                                <option value="NEWEST">Sort: Newest</option>
                                <option value="POPULAR">Sort: Most Popular</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                    
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-zinc-400 flex items-center gap-1 mr-1">
                            <Calendar className="size-3.5" /> Date:
                        </span>
                        
                        <Button
                            variant={dateFilter === "ALL" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setDateFilter("ALL")}
                            className="rounded-xl text-xs h-7 px-3 cursor-pointer"
                        >
                            All
                        </Button>
                        <Button
                            variant={dateFilter === "UPCOMING" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setDateFilter("UPCOMING")}
                            className="rounded-xl text-xs h-7 px-3 cursor-pointer"
                        >
                            Upcoming
                        </Button>
                        <Button
                            variant={dateFilter === "TODAY" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setDateFilter("TODAY")}
                            className="rounded-xl text-xs h-7 px-3 cursor-pointer"
                        >
                            Today
                        </Button>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            Showing <span className="text-primary font-bold">{filteredEvents.length}</span> of {initialEvents.length} events
                        </span>

                        {isFiltered && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                                className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl cursor-pointer"
                            >
                                <X className="size-3 mr-1" />
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20 backdrop-blur-sm space-y-4">
                    <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                        <Frown className="size-10" />
                    </div>
                    <div className="space-y-1 max-w-sm">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No events found</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            No events match your current search or filter criteria. Try searching for a different keyword or resetting filters.
                        </p>
                    </div>
                    {isFiltered && (
                        <Button
                            onClick={resetFilters}
                            variant="outline"
                            className="mt-2 rounded-full cursor-pointer text-xs font-semibold"
                        >
                            Reset All Filters
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((item) => (
                        <BrowseEvents key={item.eventId} {...item} />
                    ))}
                </div>
            )}
        </div>
    );
}
