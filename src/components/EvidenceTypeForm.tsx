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
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { z } from "zod";
import { EvidenceType, Prisma } from "@prisma/client";
import { apiClient } from "~/trpc/react";

const EvidenceTypeFormSchema = z.object({
  evidenceType: z.string().min(1, { message: "Evidence type is required" }),
});

type EvidenceTypeFormSchema = z.infer<typeof EvidenceTypeFormSchema>;

const defaultValues: EvidenceTypeFormSchema = {
  evidenceType: "",
};

export function EvidenceTypeForm() {
  const form = useForm<EvidenceTypeFormSchema>({
    resolver: zodResolver(EvidenceTypeFormSchema),
    defaultValues,
  }); // Initialize the form

  const createEvidenceType =
    apiClient.evidenceType.createEvidenceType.useMutation();

  const apiUtils = apiClient.useUtils();
  const handleSubmit = form.handleSubmit(async (data) => {
    await createEvidenceType.mutateAsync({ name: data.evidenceType });
    await apiUtils.evidenceType.invalidate();

    form.reset();
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl bg-card p-6"
      >
        <FormLabel className="text-xl text-primary">
          Create evidence type
        </FormLabel>
        <FormField
          name="evidenceType"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-primary">Evidence Type</FormLabel>
                <FormControl {...field}>
                  <Input
                    type="text"
                    className="bg-secondary text-primary"
                    placeholder="Enter evidence type"
                    {...field}
                  />
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
