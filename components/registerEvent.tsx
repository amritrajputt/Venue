"use client";

import axios from "axios";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Mail, Hash, Loader2, CalendarCheck, LogIn, Lock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";

interface FormValues {
  name: string;
  email: string;
  age: string;
}

interface RegisterEventProps {
  eventId?: number | string;
  onSuccess?: () => void;
  showCard?: boolean;
}

export default function RegisterEvent({ eventId: propEventId, onSuccess, showCard = true }: RegisterEventProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const eventId = propEventId || searchParams.get("eventId");

  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    age: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) {
      toast.error("HTTP 401 Unauthorized: Please sign in to register for events");
      setIsAuthModalOpen(true);
      return;
    }

    if (!eventId) {
      toast.error("Event ID is missing. Please select an event first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/attend-event", {
        eventId: Number(eventId),
        name: values.name,
        email: values.email,
        age: Number(values.age),
      });

      if (res.status === 200) {
        toast.success(res.data?.message || "Event registered successfully!");
        setValues({
          name: "",
          email: "",
          age: "",
        });
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(res.data?.error || "Failed to register for event");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("401 Unauthorized: Please sign in to register for this event");
        setIsAuthModalOpen(true);
        return;
      }
      const errMsg = error.response?.data?.message || error.response?.data?.error || "Failed to register for event";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <div className="space-y-4">
      {!isSessionLoading && !session && (
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs leading-relaxed">
          <AlertCircle className="size-5 shrink-0 text-amber-500 mt-0.5" />
          <div className="space-y-2 flex-1">
            <p className="font-semibold"> Authentication Required</p>
            <p>You must be signed in to your account to register for this event.</p>
            <Button
              type="button"
              onClick={() => {
                const targetUrl = eventId ? `/upcoming-events/register-event?eventId=${eventId}` : "/upcoming-events";
                router.push(`/sign-in?callbackUrl=${encodeURIComponent(targetUrl)}`);
              }}
              size="sm"
              className="mt-1 rounded-xl bg-amber-500 text-white hover:bg-amber-600 font-bold cursor-pointer"
            >
              <LogIn className="size-3.5 mr-1.5" />
              Sign In to Register
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              required
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium">
            Age
          </Label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="age"
              type="number"
              placeholder="25"
              min="1"
              max="120"
              required
              value={values.age}
              onChange={(e) => setValues({ ...values, age: e.target.value })}
              className="pl-9"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 font-semibold transition-all duration-200 cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Registering...
            </span>
          ) : !session ? (
            "Sign In to Register (401)"
          ) : (
            "Register Now"
          )}
        </Button>
      </form>

      {/* 401 Auth Modal */}
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
              You are currently not signed in. You must log in to register for this event.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 text-xs font-semibold">
            Unauthorized
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
                const targetUrl = eventId ? `/upcoming-events/register-event?eventId=${eventId}` : "/upcoming-events";
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
    </div>
  );

  if (!showCard) {
    return formContent;
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border border-border/50 bg-background/60 backdrop-blur-md">
      <CardHeader className="text-center space-y-1">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
          <CalendarCheck className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Register for Event</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Fill in your details below to secure your spot.
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}

export { RegisterEvent };
