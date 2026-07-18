import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";

type UpcomingEventsProps = {
  name: string;
  title: string;
  imageUrl: string;
  date: string;
  attendees: number;
  dateTime: string;
  location: string;
};

export function UpcomingEvents({
  name,
  title,
  imageUrl,
  date,
  attendees,
  dateTime,
  location,
}: UpcomingEventsProps) {
  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden border border-zinc-200/80 bg-white/50 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/5 dark:border-zinc-800/80 dark:bg-zinc-900/30 dark:hover:shadow-pink-500/10 max-w-sm">
      {/* Event Banner Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <img
          src={imageUrl || "/placeholder-event.png"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Attendees Count Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="secondary" className="backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 text-zinc-900 dark:text-zinc-50 border border-white/20 shadow-sm">
            <Users className="size-3.5 mr-1 text-pink-500 dark:text-pink-400" />
            <span>{attendees} Registered</span>
          </Badge>
        </div>
      </div>

      {/* Event Details Content */}
      <CardHeader className="space-y-2 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-pink-600 dark:text-pink-400">
            Hosted by {name}
          </span>
        </div>
        <CardTitle className="line-clamp-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 transition-colors group-hover:text-pink-600 dark:group-hover:text-pink-400">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {/* Date */}
        <div className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
          <Calendar className="size-4 shrink-0 text-pink-500/70 dark:text-pink-400/70" />
          <span className="font-medium">{date}</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
          <Clock className="size-4 shrink-0 text-pink-500/70 dark:text-pink-400/70" />
          <span>{dateTime}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
          <MapPin className="size-4 shrink-0 text-pink-500/70 dark:text-pink-400/70" />
          <span className="line-clamp-1">{location}</span>
        </div>
      </CardContent>

      {/* Interactive Footer Button */}
      <CardFooter className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
        <Button
          variant="outline"
          className="w-full group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-violet-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="size-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}