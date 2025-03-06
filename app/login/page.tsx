"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { passwordSchema } from '@/validation/passwordSchema';
import Link from 'next/link';
import { loginWithCredentials } from './actions';
import { useRouter } from 'next/navigation';



const formSchema = z.object({
  email: z.string().email(),
  password: passwordSchema
})

export default function Login() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await loginWithCredentials({
      email: data.email,
      password: data.password
    })

    if (response?.error) {

    } else {
      router.push('/my-account')
    }
  }

  return (
    <main className="flex items-center justify-center h-screen">
      <Card className='w-[360px]'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {/* below we're spreading props from the form component we declared above */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='flex flex-col gap-2'>
              {/* control prop controls validation */}
              <fieldset
                disabled={form.formState.isSubmitting}
                className='flex flex-col gap-2'
              >
                <FormField control={form.control} name='email' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type='email' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name='password' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type='password' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type='submit'>
                  Login
                </Button>
              </fieldset>
            </form>
          </Form>
        </CardContent>
      </Card>

    </main>
  )
}