"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface FormInput{
    title:string;
    date:string;
    isPrivate:boolean;
    startTime:string;
    duration:string;
    location:string;
    description:string;
    poster:string;
}

export default function CreateEventModal() {
    const [values,setValue] = useState<FormInput>({
        title:"",
        date:"",
        startTime:"",
        duration:"",
        isPrivate:false,
        location:"",
        description:"",
        poster:"",
    })
    const [errors,setErrors] = useState<{
        title:string;
        date:string;
        startTime:string;
        duration:string;
        location:string;
        description:string;
        poster:string;
    }>(
        {
            title:"",
            date:"",
            startTime:"",
            duration:"",
            location:"",
            description:"",
            poster:"",
        }
    )
    const [isSubmitting,setIsSubmitting] = useState(false)
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back(); 
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This modal has intercepted the dashboard route. Place your event form here.
          </p>
          <div>
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
