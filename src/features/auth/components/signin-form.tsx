"use client"
import { useForm } from "react-hook-form";
import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
//import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { FaLinkedin,FaGoogle } from "react-icons/fa";
const loginSchema=z.object({
    email:z.email("please enter a valid email address"),
    password:z.string().min(5,"password is required")
});

type loginformvalues=z.infer<typeof loginSchema>;

export function SignInForm(){
    const router=useRouter();

    const form=useForm<loginformvalues>({
        resolver:zodResolver(loginSchema),
        defaultValues:{
            email:"",
            password:""
        }
    });

    const onSubmit=async(values:loginformvalues)=>{
        // await authClient.signIn.email({
        //      email: values.email,
        //      password: values.password,
        //      callbackURL: "/",
        //    },
        //    {
        //        onSuccess:()=>{
        //            router.push("/")
        //        },
               
        //        onError:(ctx)=>{
        //            toast.error(ctx.error.message)
        //        }
           
        //    });
    };

    const isPending=form.formState.isSubmitting;
    return(
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Login to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    
                                    <Button  variant="outline" className="w-full" disabled={isPending} type="button">
                                    <FaLinkedin />
                                        Continue with linkdin
                                    </Button>
                                    <Button  variant="outline" className="w-full" disabled={isPending} type="button">
                                    <FaGoogle />
                                        Continue with google
                                    </Button>
                                </div>
                                <div className="grid gap-6">
                                    <FormField
                                    control={form.control}
                                    name="email"
                                      render={({field})=>(
                                        <FormItem           >
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" {...field} placeholder="email address"/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                      )}
                                    />
                                     <FormField
                                    control={form.control}
                                    name="password"
                                      render={({field})=>(
                                        <FormItem           >
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} placeholder="**********"/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                      )}
                                    />
                                    <Button type="submit"  disabled={isPending} className="w-full bg-red-100 hover:bg-red-200">Submit</Button>
                                    <div className="text-center text-sm">
                                        dont hve an account{" "}
                                        <Link href="/signup" className="underline underline-offset-4">SignUp</Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}