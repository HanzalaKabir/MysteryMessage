"use client";
import { use, useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

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

const Page = ({ params }: PageProps) => {
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

  function handlePromptClick(event: React.MouseEvent<HTMLSpanElement>) {
    event.preventDefault();
    const text = event.currentTarget.textContent ?? "";
    form.reset({
      anonymousMessage: text,
    });
  }
  const [geminiResponseArray, setGeminiResponseArray] = useState<string[]>([]);

  const handleSuggestMessages = useCallback(async () => {
    const geminiResponse = await axios.post<ApiResponse>(
      `/api/suggest-messages`
    );
    const responseData = geminiResponse.data.message;
    const responses = responseData.split("||");
    setGeminiResponseArray(responses);
    console.log(geminiResponseArray);
  }, [geminiResponseArray]);

  useEffect(() => {
    handleSuggestMessages();
  }, []);

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
              <Button className="block mb-4" onClick={handleSuggestMessages}>
                Suggest Messages
              </Button>
              <span className="block mb-4">
                Click on any messages below to select it
              </span>
              <div className="border-solid border-gray border-2 rounded-md p-4">
                <span className="font-medium text-xl mb-8">Suggestions</span>
                {geminiResponseArray.map((response, index) => {
                  return (
                    <span
                      className="block mb-2 border-solid border-gray text-center border-2 rounded-md p-2 hover:bg-gray-100"
                      key={`${response}+${index}`}
                      onClick={handlePromptClick}
                    >
                      {response}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>
    </div>
  );
};

export default Page;
