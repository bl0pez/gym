"use client";


import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Loader2,
  Plus,
  Trash2,
  Save,
  Dumbbell,

  Timer,
  Layers,

} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createRoutine, updateRoutine } from "@/actions/routine-actions";
import { format } from "date-fns";

const schemaRoutineSet = yup.object({
  sets: yup.string().required(),
  repetitions: yup.string().required(),
  weight: yup.string().optional(),
});

const formSchema = yup.object({
  category: yup.string().required(),
  name: yup.string().required(),
  date: yup.date().required(),
  sets: yup.array().of(schemaRoutineSet).min(1).required(),
  observations: yup.string().required(),
});

export type RoutineFormSchema = yup.InferType<typeof formSchema>;

interface RoutineFormProps {
  initialData?: Partial<RoutineFormSchema> | null;
  routineId?: string;
  onSuccess?: () => void;
}

export function RoutineForm({
  initialData,
  routineId,
  onSuccess,
}: RoutineFormProps) {
  const defaultValues: Partial<RoutineFormSchema> = {
    date: new Date(),
    sets: [{ sets: "1", repetitions: "10", weight: "0" }],
    name: "",
    observations: "",
    category: "",
    ...(initialData || {}),
  };

  const form = useForm<RoutineFormSchema>({
    resolver: yupResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sets",
  });

  const { isSubmitting } = form.formState;



  async function onSubmit(values: RoutineFormSchema) {
    const action = routineId ? updateRoutine.bind(null, routineId) : createRoutine
    const { error } = await action(values)

    if (error) {
      toast.error(error)
      return
    }

    toast.success(routineId ? "Routine updated successfully" : "Routine created successfully")

    if (!routineId) {
      form.reset({
        ...values,
        sets: [{ sets: "1", repetitions: "10", weight: "" }],
        name: "",
        observations: "",
      })
    }

    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Exercise Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Bench Press" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
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
            <FormItem className="col-span-2">
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={
                    field.value
                      ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm")
                      : ""
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? new Date(e.target.value) : new Date(),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Work Sets</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your volume
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {fields.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed rounded-xl ">
                <Dumbbell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm mb-4">
                  No sets added yet
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({ sets: "1", repetitions: "10", weight: "" })
                  }
                >
                  Add First Set
                </Button>
              </div>
            )}

            <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-1">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm"
                >
                  <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive sm:hidden ml-auto"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 flex-1 w-full">
                    <FormField
                      control={form.control}
                      name={`sets.${index}.sets`}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-[10px] uppercase text-muted-foreground font-bold pl-1">
                            Sets
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                              className="h-9 text-center font-mono font-medium"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`sets.${index}.repetitions`}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-[10px] uppercase text-muted-foreground font-bold pl-1">
                            Reps
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                              className="h-9 text-center font-mono font-medium"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`sets.${index}.weight`}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-[10px] uppercase text-muted-foreground font-bold pl-1">
                            Kg
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                              className="h-9 text-center font-mono font-medium"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity self-center mt-6"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {fields.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    sets: "1",
                    repetitions: "10",
                    weight: "",
                  })
                }
                className="w-full border-dashed"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Set Group
              </Button>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observations</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notes about form, RPE, or feelings..."
                  className="resize-none min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {routineId ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {routineId ? "Update Routine" : "Create Routine"}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
