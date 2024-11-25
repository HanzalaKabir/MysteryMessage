"use client";
import { use } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  anonymousMessage: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    }),
});

type PageProps = {
  params: Promise<{
    params: string[];
  }>;
};

const page = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  const username = resolvedParams.params?.[0];

  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      anonymousMessage: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  return (
    <div className="my-8">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-6 gap-3">
          <div className="col-span-1"></div>
          <div className="col-span-4">
            <div className="font-bold text-4xl mb-6 text-center">
              Public Profile Link
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-auto space-y-6 mx-auto"
              >
                <FormField
                  control={form.control}
                  name="anonymousMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Send anonymous message to @{username}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your anonymous message here"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="flex mx-auto">
                  Submit
                </Button>
              </form>
            </Form>
            <div className="mt-20">
              <Button>Button</Button>
            </div>
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>
    </div>
  );
};

export default page;
