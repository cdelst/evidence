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

const TagFormSchema = z.object({
  tagName: z.string().min(1, { message: "Tag name is required" }),
});

type TagFormSchema = z.infer<typeof TagFormSchema>;

const defaultValues: TagFormSchema = {
  tagName: "",
};

export function TagForm() {
  const form = useForm<TagFormSchema>({
    resolver: zodResolver(TagFormSchema),
    defaultValues,
  }); // Initialize the form

  const createTag = apiClient.tags.createTag.useMutation();

  const apiUtils = apiClient.useUtils();
  const handleSubmit = form.handleSubmit(async (data) => {
    await createTag.mutateAsync({ name: data.tagName });
    await apiUtils.tags.invalidate();

    form.reset();
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl bg-card p-6"
      >
        <FormLabel>Create Tag</FormLabel>
        <FormField
          name="tagName"
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
        <div className="flex justify-end">
          <Button type="submit" className="mt-2 w-min">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
