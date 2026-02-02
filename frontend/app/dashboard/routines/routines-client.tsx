"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Dumbbell, 
  Clock, 
  Weight,
  MoreVertical,
  Loader2,
  Calendar,
  Copy,
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import api from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = yup.object({
  name: yup.string().min(2, "Name must be at least 2 characters.").required("Name is required"),
  category: yup.string().min(1, "Category is required.").required(),
  date: yup.string().required("Date is required"),
  sets: yup.array().of(
    yup.object({
      series: yup.number().min(1).required(),
      repetitions: yup.number().min(1).required(),
      weight: yup.string().optional(),
      time: yup.string().optional(),
      rest: yup.string().optional(),
    })
  ).min(1, "At least one set is required").required(),
  observations: yup.string().ensure().default(""),
}).required()

type RoutineFormValues = yup.InferType<typeof formSchema>

interface RoutineSet {
  series: number
  repetitions: number
  weight?: string
  time?: string
  rest?: string
}

interface Routine {
  id: string
  name: string
  category: string
  date: string
  sets: RoutineSet[]
  observations: string
}

interface RoutinesClientProps {
    initialRoutines: Routine[];
}

export function RoutinesClient({ initialRoutines }: RoutinesClientProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)

  const form = useForm<RoutineFormValues>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
      sets: [{ series: 1, repetitions: 10, weight: "", time: "", rest: "" }],
      observations: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sets",
  })

  // Handle Sheet Open state
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setEditingRoutine(null)
      form.reset({
        name: "",
        category: "",
        date: new Date().toISOString().split('T')[0],
        sets: [{ series: 1, repetitions: 10, weight: "", time: "", rest: "" }],
        observations: "",
      })
    }
  }

  // Edit Routine
  const handleEdit = (routine: Routine) => {
    setEditingRoutine(routine)
    form.reset({
      name: routine.name,
      category: routine.category,
      date: routine.date,
      sets: (routine.sets || []).map(s => ({
          series: s.series,
          repetitions: s.repetitions,
          weight: s.weight || "",
          time: s.time || "",
          rest: s.rest || "",
      })),
      observations: routine.observations || "",
    })
    setIsOpen(true)
  }

  // Repeat Routine
  const handleRepeat = (routine: Routine) => {
    setEditingRoutine(null) // Create new
    form.reset({
      name: routine.name,
      category: routine.category,
      date: new Date().toISOString().split('T')[0],
      sets: (routine.sets || []).map(s => ({
          series: s.series,
          repetitions: s.repetitions,
          weight: s.weight || "",
          time: s.time || "",
          rest: s.rest || "",
      })),
      observations: routine.observations || "",
    })
    setIsOpen(true)
  }

  // Delete Routine
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this routine?")) return
    try {
      await api.delete(`/routines/${id}`)
      toast.success("Routine deleted")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete routine")
    }
  }

  // Submit Form
  async function onSubmit(values: RoutineFormValues) {
    setIsLoading(true)
    try {
      if (editingRoutine) {
        await api.patch(`/routines/${editingRoutine.id}`, values)
        toast.success("Routine updated")
      } else {
        await api.post("/routines", values)
        toast.success("Routine created")
      }
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Failed to save routine")
    } finally {
      setIsLoading(false)
    }
  }

  // Group routines by date
  const groupedRoutines = initialRoutines.reduce((acc, routine) => {
    const date = routine.date || "unknown";
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
      if (isNaN(parsedDate.getTime())) return "Unknown Date";
      return format(parsedDate, "EEEE, d MMMM yyyy");
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
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Routine
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
            <SheetHeader className="pb-6">
              <SheetTitle>{editingRoutine ? "Edit Routine" : "Add Routine"}</SheetTitle>
              <SheetDescription>
                {editingRoutine ? "Make changes to your routine here." : "Add a new exercise to your training plan."}
              </SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pr-2">
                <div className="space-y-4 border-b pb-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exercise Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Bench Press" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Chest">Chest</SelectItem>
                              <SelectItem value="Back">Back</SelectItem>
                              <SelectItem value="Legs">Legs</SelectItem>
                              <SelectItem value="Shoulders">Shoulders</SelectItem>
                              <SelectItem value="Arms">Arms</SelectItem>
                              <SelectItem value="Core">Core</SelectItem>
                              <SelectItem value="Cardio">Cardio</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sets</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => append({ series: fields.length + 1, repetitions: 10, weight: "", time: "", rest: "" })}
                    >
                      <Plus className="mr-2 h-3 w-3" /> Add Set
                    </Button>
                  </div>
                  
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4 bg-muted/30">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase">Set {index + 1}</span>
                        {fields.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`sets.${index}.repetitions`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase">Reps</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`sets.${index}.weight`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase">Weight</FormLabel>
                              <FormControl>
                                <Input placeholder="50kg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name={`sets.${index}.time`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase">Time</FormLabel>
                              <FormControl>
                                <Input placeholder="30s" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`sets.${index}.rest`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase">Rest</FormLabel>
                              <FormControl>
                                <Input placeholder="1m" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observations</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Focus on form..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SheetFooter className="pt-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingRoutine ? "Update Routine" : "Create Routine"}
                  </Button>
                </SheetFooter>
              </form>
            </Form>
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
                <Card key={routine.id} className="relative overflow-hidden transition-all hover:shadow-md border-l-4 border-l-primary">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
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
                      {(routine.sets || []).map((set, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm py-1 border-b last:border-0 border-dashed border-muted">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs bg-primary/10 text-primary w-5 h-5 flex items-center justify-center rounded-full">{idx + 1}</span>
                            <span className="text-muted-foreground">{set.repetitions} reps</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                             {set.weight && (
                                <div className="flex items-center gap-1">
                                  <Weight className="h-3 w-3 text-muted-foreground" />
                                  <span>{set.weight}</span>
                                </div>
                             )}
                             {set.time && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{set.time}</span>
                                </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                        <p className="mt-4 text-xs text-muted-foreground line-clamp-2 italic">
                          &quot;{routine.observations}&quot;
                        </p>
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
