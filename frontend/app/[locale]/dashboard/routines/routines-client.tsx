"use client"

import { useState } from "react"
import { 
  Pencil, 
  Trash2, 
  Dumbbell, 
  Weight,
  MoreVertical,
  Calendar,
  Copy,
  Timer,
  Plus
} from "lucide-react"

import { toast } from "sonner"
import { deleteRoutine } from "@/actions/routine-actions"
import type { Routine } from "@/types"
import { format, parseISO } from "date-fns"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RoutineForm, RoutineFormSchema } from "./routine-form"

interface RoutinesClientProps {
  initialRoutines: Routine[];
}

const CATEGORY_IMAGES: Record<string, string> = {
  "Chest": "/assets/categories/Chest.png",
  "Back": "/assets/categories/Back.png",
  "Legs": "/assets/categories/Legs.png",
  "Shoulders": "/assets/categories/Shoulders.png",
  "Arms": "/assets/categories/Arms.png",
  "Core": "/assets/categories/Core.png",
  "Cardio": "/assets/categories/Cardio.png",
};

export function RoutinesClient({ initialRoutines }: RoutinesClientProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | undefined>(undefined)
  const [formData, setFormData] = useState<Partial<RoutineFormSchema> | undefined>(undefined);

  console.log(initialRoutines);

  const handleSuccess = () => {
    setIsOpen(false)
    router.refresh()
  }

  // Handle Sheet Open state
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setEditingId(undefined)
      setFormData(undefined)
    }
  }

  // Edit Routine
  const handleEdit = (routine: Routine) => {
    setEditingId(routine.id)
    setFormData({
      name: routine.name,
      category: routine.category,
      date: routine.date,
      sets: routine.sets.map(s => ({
        sets: String(s.sets),
        repetitions: String(s.repetitions),
        weight: String(s.weight),
      })),
      observations: routine.observations || "",
    })
    setIsOpen(true)
  }

  // Repeat Routine
  const handleRepeat = (routine: Routine) => {
    setEditingId(undefined)
    setFormData({
      name: routine.name,
      category: routine.category,
      date: new Date(routine.date),
      sets: routine.sets.map(s => ({
        sets: String(s.sets),
        repetitions: String(s.repetitions),
        weight: String(s.weight),
      })),
      observations: routine.observations || "",
    })
    setIsOpen(true)
  }

  // Delete Routine
  const handleDelete = async (id: string) => {
    toast.promise(deleteRoutine(id), {
      loading: 'Deleting routine...',
      success: (data) => {
         if (data.error) throw new Error(data.error)
         router.refresh()
         return 'Routine deleted'
      },
      error: (err) => err.message || 'Failed to delete routine'
    })
  }

  // Group routines by date
  const groupedRoutines = initialRoutines.reduce((acc, routine) => {
    const date = routine.date.toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(routine);
    return acc;
  }, {} as Record<string, Routine[]>);

  // Sort dates descending
  const sortedDates = Object.keys(groupedRoutines).sort((a, b) => {
    if (a === "unknown") return 1;
    if (b === "unknown") return -1;
    return b.localeCompare(a);
  });

  const safeFormatDate = (dateStr: string) => {
    if (dateStr === "unknown") return "No Date Set";
    try {
      const parsedDate = parseISO(dateStr);
      return format(parsedDate, "EEEE, d 'of' MMMM");
    } catch {
      return "Unknown Date";
    }
  };

  const getDayCategories = (date: string) => {
    const routines = groupedRoutines[date] || [];
    const categories = Array.from(new Set(routines.map(r => r.category)));
    return categories.join(", ");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Routines</h1>
          <p className="text-muted-foreground">Manage and track your daily training.</p>
        </div>
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button onClick={() => { setEditingId(undefined); setFormData(undefined); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Routine
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px] px-4 py-6">
            <SheetHeader className="px-0">
              <SheetTitle>{editingId ? "Edit Routine" : "Add Routine"}</SheetTitle>
              <SheetDescription>
                {editingId ? "Make changes to your routine here." : "Add a new exercise to your training plan."}
              </SheetDescription>
            </SheetHeader>
            
            <RoutineForm 
              // initialData={formData} 
              routineId={editingId} 
              onSuccess={handleSuccess} 
            />

          </SheetContent>
        </Sheet>
      </div>


      <div className="space-y-10">
        {sortedDates.map((date) => (
          <div key={date} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">
                  {safeFormatDate(date)}
                </h2>
              </div>
              <p className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {getDayCategories(date)}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groupedRoutines[date].map((routine) => (
                <Card key={routine.id} className="group relative overflow-hidden transition-all hover:shadow-lg border-l-4 border-l-primary bg-card/50 backdrop-blur-sm">
                  {CATEGORY_IMAGES[routine.category] && (
                    <div className="absolute -right-4 -top-4 w-28 h-28 opacity-[0.08] group-hover:opacity-15 transition-opacity pointer-events-none">
                       <Image 
                          src={CATEGORY_IMAGES[routine.category]} 
                          alt={routine.category} 
                          fill
                          className="object-contain"
                       />
                    </div>
                  )}
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 relative z-10">
                      <div className="space-y-1">
                          <CardTitle className="text-base font-semibold">
                              {routine.name}
                          </CardTitle>
                          <CardDescription>{routine.category}</CardDescription>
                      </div>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(routine)}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRepeat(routine)}>
                                  <Copy className="mr-2 h-4 w-4" /> Repeat
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(routine.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {routine.sets.map((set, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm py-2 border-b last:border-0 border-border/50">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-center justify-center bg-primary/10 px-2 py-1 rounded min-w-12">
                               <span className="text-lg font-bold text-primary leading-none">{set.sets || 1}</span>
                               <span className="text-[10px] uppercase font-bold text-primary/60">SETS</span>
                            </div>
                            <div className="text-2xl text-muted-foreground/30 font-light">×</div>
                            <div className="flex flex-col">
                               <span className="font-medium text-base">{set.repetitions}</span>
                               <span className="text-xs text-muted-foreground">reps</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-md">
                            <Weight className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm font-medium">{set.weight ?? 0} <span className="text-muted-foreground text-xs">kg</span></span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {routine.observations && (
                        <div className="mt-4 pt-3 border-t border-dashed">
                            <p className="text-xs text-muted-foreground line-clamp-2 italic">
                              &quot;{routine.observations}&quot;
                            </p>
                        </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {initialRoutines.length === 0 && (
            <div className="flex flex-col items-center justify-center p-20 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
                <Dumbbell className="h-16 w-16 mb-4 opacity-10" />
                <h3 className="text-lg font-medium text-foreground">No routines for today</h3>
                <p className="max-w-xs mx-auto mt-2">Start your training by adding your first exercise.</p>
                <Button variant="outline" className="mt-6" onClick={() => handleOpenChange(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Routine
                </Button>
            </div>
        )}
      </div>
    </div>
  )
}
