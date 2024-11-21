"use client";

import { supabase } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const loginFormSchema = z.object({
  id: z.string().min(1, "아이디를 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  function handleLogin(data: z.infer<typeof loginFormSchema>) {
    const id = data.id;
    const password = data.password;

    (async () => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: id,
          password,
        });
        if (error) {
          throw error;
        }
        window.history.pushState({}, "", "/admin");
      } catch {
        return;
      }
    })();
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleLogin)}>
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="id">ID</FormLabel>
              <Input
                {...field}
                type="text"
                placeholder="아이디를 입력하세요"
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="id">패스워드</FormLabel>
              <Input
                {...field}
                type="password"
                placeholder="패스워드를 입력하세요"
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormItem>
          )}
        />
        <Button className="font-bold text-lg w-full" type="submit">
          로그인
        </Button>
      </form>
    </Form>
  );
}
