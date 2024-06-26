"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PopoverClose } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { cn } from "~/lib/utils";
import { apiClient } from "~/trpc/react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import MultiSelect from "./ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";

const EvidenceFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  impact: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  date: z.date().max(new Date(), { message: "Date must be in the past" }),
  description: z.string().min(1, { message: "Description is required" }),
  evidenceType: z.string().cuid({ message: "Evidence is required" }),
  context: z.string().min(1, { message: "Context is required" }),
  source: z.string().min(1, { message: "Source is required" }),
  tags: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      disable: z.boolean().optional(),
    }),
  ),
});

type EvidenceFormSchema = z.infer<typeof EvidenceFormSchema>;

const defaultValues: EvidenceFormSchema & { id: string } = {
  id: "",
  title: "",
  impact: "1",
  date: new Date(),
  description: "",
  evidenceType: "",
  context: "",
  source: "",
  tags: [],
};

export function EvidenceForm({
  initialData,
  handleClose,
}: {
  initialData?: EvidenceFormSchema & { id: string };
  handleClose: () => void;
}) {
  const form = useForm<EvidenceFormSchema>({
    resolver: zodResolver(EvidenceFormSchema),
    defaultValues: initialData ?? defaultValues,
  });

  const [useCustomEvidenceType, setUseCustomEvidenceType] = useState(false);

  const utils = apiClient.useUtils();

  const createEvidence = apiClient.evidence.createEvidence.useMutation();
  const updateEvidence = apiClient.evidence.updateEvidence.useMutation();

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log("submitting");
    const transformedData = {
      ...data,
      type: useCustomEvidenceType ? data.evidenceType : defaultEvidenceType ?? "",
      impact: Number(data.impact), // Convert impact from string to number
      tags: data.tags.map((tag) => tag.value),
    };

    // Ensure impact is a number, not a string
    if (isNaN(transformedData.impact)) {
      console.error("Impact must be a number");
      return; // Optionally handle this case more gracefully
    }

    if (initialData) {
      // Update existing evidence
      await updateEvidence.mutateAsync({
        id: initialData.id,
        ...transformedData,
      });
    } else {
      // Create new evidence
      await createEvidence.mutateAsync(transformedData);
    }

    await utils.evidence.invalidate();
    form.reset();
    handleClose();
  });

  const { data: evidenceTypes } =
    apiClient.evidenceType.getAllEvidenceTypes.useQuery();

  const { data: tags } = apiClient.tags.getAllTags.useQuery();

  const tagOptions = tags?.map((tag) => ({
    label: tag.name,
    value: tag.id,
  }));

  // Find the matching evidence type to pre-set it when given initialData
  const defaultEvidenceType = initialData
    ? evidenceTypes?.find((type) => type.name === initialData.evidenceType)?.id
    : "";

  form.setValue("evidenceType", defaultEvidenceType ?? ""); 

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="gap-6 rounded-xl bg-card p-6">
        <div className="flex flex-col gap-5">
          <Label className="text-3xl text-primary ">
            {initialData ? "Edit Evidence" : "Create Evidence"}
          </Label>
          <div className="flex flex-1 flex-wrap gap-4">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl {...field}>
                    <Input {...field} placeholder="Enter title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="evidenceType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evidence Type</FormLabel>
                  <FormControl {...field}>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setUseCustomEvidenceType(true);
                      }}
                      value={
                        useCustomEvidenceType ? field.value : defaultEvidenceType
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {evidenceTypes?.map((evidenceType) => (
                          <SelectItem
                            key={evidenceType.id}
                            value={evidenceType.id}
                          >
                            {evidenceType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full">
              <FormField
                name="impact"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Impact</FormLabel>
                    <FormControl {...field}>
                      <div className="flex flex-col items-center">
                        <Slider
                          defaultValue={[1]}
                          value={[Number(form.getValues("impact"))]}
                          onValueChange={(vals) => {
                            field.onChange(Number(vals[0]));
                          }}
                          min={1}
                          max={5}
                          step={1}
                        />
                        <FormLabel className="mt-2 text-sm">
                          {field.value}
                        </FormLabel>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="date"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full bg-accent pl-3 text-left font-normal text-primary",
                              !field.value && "text-muted-foreground ",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <PopoverClose>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverClose>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl {...field}>
                    <Textarea {...field} placeholder="Enter description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="context"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Context</FormLabel>
                  <FormControl {...field}>
                    <Input {...field} placeholder="Enter context" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="source"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl {...field}>
                    <Input {...field} placeholder="Enter source" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="tags"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <MultiSelect
                    value={field.value}
                    onChange={field.onChange}
                    defaultOptions={tagOptions}
                    options={tagOptions}
                    onSearch={(searchTerm) => {
                      if (searchTerm === "") {
                        return Promise.resolve(tagOptions ?? []);
                      }
                      const filteredTags =
                        tagOptions?.filter((tag) => {
                          const tagName = tag.label.toLowerCase();
                          const tagDescription = tags?.find(
                            (t) => t.id === tag.value,
                          )?.description;
                          return (
                            tagName.includes(searchTerm.toLowerCase()) ||
                            tagDescription?.includes(searchTerm.toLowerCase())
                          );
                        }) ?? [];
                      return Promise.resolve(filteredTags);
                    }}
                    placeholder={
                      tags?.length === 0
                        ? "Create a tag first"
                        : "Select tags..."
                    }
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                    disabled={tags?.length === 0}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full justify-end">
            <Button type="submit" className="mt-2 w-min">
              {initialData ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
