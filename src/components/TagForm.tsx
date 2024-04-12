"use client";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { apiClient } from "~/trpc/react";
import { Textarea } from "./ui/textarea";

const TagFormSchema = z.object({
  name: z.string().min(1, { message: "Tag name is required" }),
  description: z.string(),
});

type TagFormSchema = z.infer<typeof TagFormSchema>;

const defaultValues: TagFormSchema = {
  name: "",
  description: "",
};

export function TagForm() {
  const form = useForm<TagFormSchema>({
    resolver: zodResolver(TagFormSchema),
    defaultValues,
  }); // Initialize the form

  const createTag = apiClient.tags.createTag.useMutation();

  const apiUtils = apiClient.useUtils();
  const handleSubmit = form.handleSubmit(async ({ name, description }) => {
    await createTag.mutateAsync({ name, description });
    await apiUtils.tags.invalidate();

    form.reset();
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex  flex-col gap-4 rounded-xl bg-card p-6"
      >
        <FormLabel>Create Tag</FormLabel>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Tag Name</FormLabel>
                <FormControl {...field}>
                  <Input type="text" placeholder="Enter tag name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl {...field}>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            );
          }}
        />
        <div className="flex justify-end">
          <Button type="submit" className="mt-2 w-min">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
