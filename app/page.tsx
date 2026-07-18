"use client"
 
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from "next/link";
import { CanvasText } from "@/components/ui/canvas-text";
import { 
  CheckCircle2, 
  Search, 
  Bell, 
  BarChart3
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleGetstarted = (path: string) => {
    router.push(path);
  }
  const handleCreateEvent = (path:string) => {
    router.push(path)
  }
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      
      <header className="sticky top-0 z-50 w-full bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-md overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
              <img src="/4085.jpg" alt="Venue Logo" className="w-full h-full object-cover scale-150" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-pink-600 bg-clip-text text-transparent dark:from-pink-400 dark:to-pink-400">
              Venue
            </span>
          </Link>
 
          <nav>
            <ul className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400 ">
              <li>
                <Link href="/" className="transition-colors hover:text-pink-500 dark:hover:text-pink-500">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#features" className="transition-colors hover:text-pink-500 dark:hover:text-pink-500">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#steps" className="transition-colors hover:text-pink-500 dark:hover:text-pink-500">
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
 
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link
              href="/sign-in"
              className="text-sm font-medium text-zinc-600 hover:text-pink-500 dark:text-zinc-400 dark:hover:text-pink-500 transition-colors  px-4 py-2 rounded-full"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>
 
      <main className="flex-1 relative overflow-hidden flex flex-col items-center pt-8 lg:pt-16 pb-24">
        
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[5%] top-[10%] h-[500px] w-[500px] rounded-full bg-pink-500/10 blur-3xl dark:bg-pink-500/5" />
          <div className="absolute right-[5%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/5" />
        </div>
 
        <div className="mx-auto max-w-7xl w-full px-6 pt-4 pb-16 lg:pt-8 lg:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8 max-w-2xl mx-auto lg:mx-0">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-zinc-950 dark:text-zinc-50 leading-none">
              Discover & create amazing, <br />
              <span className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent dark:from-pink-400 dark:to-violet-400">
                <CanvasText
                  text="Events."
                  backgroundClassName="bg-zinc-50 dark:bg-zinc-950"
                  colors={[
                    "rgba(236, 72, 153, 1)",
                    "rgba(236, 72, 153, 0.9)",
                    "rgba(236, 72, 153, 0.8)",
                    "rgba(236, 72, 153, 0.7)",
                    "rgba(236, 72, 153, 0.6)",
                    "rgba(236, 72, 153, 0.5)",
                    "rgba(236, 72, 153, 0.4)",
                    "rgba(236, 72, 153, 0.3)",
                    "rgba(236, 72, 153, 0.2)",
                    "rgba(236, 72, 153, 0.1)",
                  ]}
                  lineGap={3}
                  animationDuration={10}
                />
              </span>
            </h1>
            
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Venue is a platform built for free and RSVP-based events. 
              Track attendees, analyze engagement, and automate communications in one place.
            </p>
     
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button onClick={() => handleCreateEvent('/create-event')} className="rounded-full bg-gradient-to-r from-pink-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-pink-500 hover:to-violet-500 hover:shadow-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                Create an Event
              </button>
              <Link href="/explore-events" className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                Explore Events <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
 
          <div className="relative w-full max-w-2xl mx-auto lg:max-w-none flex justify-center items-center lg:translate-x-6">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-3xl blur-2xl transform scale-95" />
            <img
              src="/hero.png"
              alt="Venue Dashboard Demo"
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>
        </div>
 
        <div id="features" className="mx-auto max-w-7xl w-full px-6 py-20 lg:py-28 space-y-12 border-t border-zinc-200/40 dark:border-zinc-800/40">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">Rich Ecosystem</span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything you need to host events
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Venue gives you simple and direct hosting options, so you can manage meetups without overhead fees or complicated tickets.
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           
            <div className="relative group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/50 p-8 hover:shadow-lg transition-all dark:border-zinc-800/80 dark:bg-zinc-900/30 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400">
                  <CheckCircle2 className="size-6" />
                </div>
                <h3 className="text-xl font-bold">Seamless RSVP System</h3>
              </div>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Attendees can submit RSVPs (Going, Interested, or Not) instantly. Custom caps allow for smart occupancy limits, automatically shifting guests to waitlists.
              </p>
            </div>
 
            <div className="relative group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/50 p-8 hover:shadow-lg transition-all dark:border-zinc-800/80 dark:bg-zinc-900/30 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
                  <Search className="size-6" />
                </div>
                <h3 className="text-xl font-bold">Smart Search & Filter</h3>
              </div>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Allows attendees to browse events by tags, dates, and locations. Active filter states persist in the URL so that customized lists are fully shareable.
              </p>
            </div>
 
            <div className="relative group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/50 p-8 hover:shadow-lg transition-all dark:border-zinc-800/80 dark:bg-zinc-900/30 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400">
                  <Bell className="size-6" />
                </div>
                <h3 className="text-xl font-bold">Automated Communication</h3>
              </div>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Email confirmations are dispatched automatically on RSVP. Pre-event notifications are triggered exactly 24 hours prior to starting, powered by Inngest workflows.
              </p>
            </div>
 
            <div className="relative group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/50 p-8 hover:shadow-lg transition-all dark:border-zinc-800/80 dark:bg-zinc-900/30 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
                  <BarChart3 className="size-6" />
                </div>
                <h3 className="text-xl font-bold">Live Organizer Analytics</h3>
              </div>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Review visitor velocity, page counts, and export guest data in standard formats. The dashboard monitors signup progression metrics to make planning simple.
              </p>
            </div>
          </div>
        </div>
 
        <div id="steps" className="mx-auto max-w-7xl w-full px-6 py-20 lg:py-28 space-y-16 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Timeline</span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Host your next event in 3 simple steps
            </h2>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            
            <div className="space-y-4">
              <div className="mx-auto md:mx-0 size-10 rounded-full bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold text-base">
                1
              </div>
              <h3 className="text-xl font-bold">Publish Details</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Fill in date, time, venue, and descriptions. Configure limits, capacities, and set waitlist details with ease.
              </p>
            </div>
 
            <div className="space-y-4">
              <div className="mx-auto md:mx-0 size-10 rounded-full bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-base">
                2
              </div>
              <h3 className="text-xl font-bold">Share link</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Distribute your custom Venue URL on social channels. Attendees can join or express interest instantly.
              </p>
            </div>
 
            <div className="space-y-4">
              <div className="mx-auto md:mx-0 size-10 rounded-full bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold text-base">
                3
              </div>
              <h3 className="text-xl font-bold">Automated Emails</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Inngest takes care of dispatching immediate confirmations and scheduled reminders 24h prior.
              </p>
            </div>
          </div>
        </div>
 
        <div className="mx-auto max-w-7xl w-full px-6 py-12 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-20">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 dark:bg-zinc-900 px-6 py-16 shadow-2xl text-center space-y-6 sm:px-12 sm:py-20 border border-zinc-800">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.15),transparent_60%)]" />
            
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl max-w-2xl mx-auto leading-tight">
              Ready to host your next successful event?
            </h2>
            <p className="mx-auto max-w-xl text-base text-zinc-400 leading-relaxed">
              Create an event dashboard in seconds, set RSVP capacity limits, and let Venue automate confirmation and reminder emails for you.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button className="rounded-full bg-white text-zinc-900 px-8 py-3 text-sm font-bold shadow-sm hover:bg-zinc-100 transition-colors">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
 
      </main>
 
      <footer className="w-full border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/10 dark:bg-zinc-950/10 backdrop-blur-sm py-12 px-6 transition-colors">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-md overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                <img src="/4085.jpg" alt="Venue Logo" className="w-full h-full object-cover scale-150" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-pink-600 bg-clip-text text-transparent dark:from-pink-400 dark:to-pink-400">
                Venue
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Event organizer platform for free, RSVP-based meetups and gatherings.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Product</h4>
            <ul className="mt-4 space-y-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              <li><Link href="/" className="hover:text-pink-600 transition-colors">Explore Events</Link></li>
              <li><Link href="#features" className="hover:text-pink-600 transition-colors">Features</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">About</h4>
            <ul className="mt-4 space-y-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              <li><Link href="/" className="hover:text-pink-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/" className="hover:text-pink-650 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Contact</h4>
            <ul className="mt-4 space-y-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium font-mono">
              <li>amrit.createch@gmail.com</li>
              <li>India</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl pt-8 mt-8 border-t border-zinc-200/30 dark:border-zinc-800/30 flex flex-col md:flex-row justify-between items-center text-[10px] font-medium text-zinc-400">
          <p>© {new Date().getFullYear()} Venue. All rights reserved.</p>
          <p className="mt-4 md:mt-0 flex gap-4">
            <Link href="https://x.com/amrit_xrajput" className="hover:text-pink-600">Twitter</Link>
            <Link href="https://github.com/amritrajputt" className="hover:text-pink-600">GitHub</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
