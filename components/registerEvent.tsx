"use client";

import axios from "axios";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { User, Mail, Hash, Loader2, CalendarCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
  const eventId = propEventId || searchParams.get("eventId");

  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    age: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      const errMsg = error.response?.data?.error || error.response?.data?.message || "Failed to register for event";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
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
        className="w-full mt-2 font-semibold transition-all duration-200"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Registering...
          </span>
        ) : (
          "Register Now"
        )}
      </Button>
    </form>
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
