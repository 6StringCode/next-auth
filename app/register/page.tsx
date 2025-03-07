"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { passwordMatchSchema } from '@/validation/passwordMatchSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { registerUser } from './actions';
import Link from 'next/link';


const formSchema = z.object({
  email: z.string().email(),
  //no longer need the below because of the passwordMatchSchema we created
  // password: passwordSchema,
  // passwordConfirm: z.string(),
}).and(passwordMatchSchema);

export default function Register() {
  //made time of the form schema we created above
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    }
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await registerUser({
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm
    })

    if (response?.error) {
      form.setError('email', {
        message: response.message
      })
    }
  }

  return (
    <main className="flex items-center justify-center h-screen">
      {form.formState.isSubmitSuccessful ? (
        <Card className='w-[360px]'>
          <CardHeader>
            <CardTitle className='text-center'>Your account has been created.</CardTitle>
          </CardHeader>
          <CardContent>
            {/* asChild applies styles to child component */}
            <Button asChild className='w-full'>
              <Link href='/login'>
                Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) :
        <Card className='w-[360px]'>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Register for a New Account</CardDescription>
          </CardHeader>
          <CardContent>
            {/* below we're spreading props from the form component we declared above */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-2'>
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
                  <FormField control={form.control} name='passwordConfirm' render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input {...field} type='password' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type='submit'>
                    Register
                  </Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
          <CardFooter className='flex-col gap-2'>
            <div className='text-muted-foreground text-sm'>
              Already have an account? {' '}<Link href='/login' className='underline'>Login</Link>
            </div>
          </CardFooter>
        </Card>
      }
    </main >
  )
}