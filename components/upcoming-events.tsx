
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, MapPin, Users, ArrowRight, Trash2 } from "lucide-react";

type UpcomingEventsProps = {
  name: string;
  title: string;
  imageUrl: string;
  date: string;
  attendees: number;
  dateTime: string;
  location: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function UpcomingEvents({
  name,
  title,
  imageUrl,
  date,
  attendees,
  dateTime,
  location,
  onEdit,
  onDelete,
}: UpcomingEventsProps) {
  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden border border-zinc-200/80 bg-white/50 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/5 dark:border-zinc-800/80 dark:bg-zinc-900/30 dark:hover:shadow-pink-500/10 max-w-sm">
     
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <img
          src={imageUrl || "/placeholder-event.png"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
       
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="secondary" className="backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 text-zinc-900 dark:text-zinc-50 border border-white/20 shadow-sm">
            <Users className="size-3.5 mr-1 text-pink-500 dark:text-pink-400" />
            <span>{attendees} Registered</span>
          </Badge>
        </div>
      </div>

     
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
      
        <div className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
          <Calendar className="size-4 shrink-0 text-pink-500/70 dark:text-pink-400/70" />
          <span className="font-medium">{date}</span>
        </div>

        <div className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
          <Clock className="size-4 shrink-0 text-pink-500/70 dark:text-pink-400/70" />
          <span>{dateTime}</span>
        </div>

        <div className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
          <MapPin className="size-4 shrink-0 text-pink-500/70 dark:text-pink-400/70" />
          <span className="line-clamp-1">{location}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex gap-2">
        <Button
          onClick={onEdit}
          variant="outline"
          className="flex-1 cursor-pointer"
        >
          <span>View Details / Edit</span>
          <ArrowRight className="size-4 ml-1.5 transition-transform group-hover:translate-x-1" />
        </Button>
        {onDelete && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            variant="outline"
            size="icon"
            className="shrink-0 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
            title="Delete Event"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}