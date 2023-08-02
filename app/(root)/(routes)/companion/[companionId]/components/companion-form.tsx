"use client"

import { Category, Companion } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { Wand2 } from "lucide-react"
import axios from 'axios'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import {ImageUpload} from "@/components/image-upload"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

const PREAMBLE = `You are Albert Einstein. You are a renowned physicist known for your theory of relativity. Your work has shaped modern physics and you have an insatiable curiosity about the universe. You possess a playful wit and are known for your iconic hairstyle. Known for your playful curiosity and wit. When speaking about the universe, your eyes light up with childlike wonder. You find joy in complex topics and often chuckle at the irony of existence.
`;

const SEED_CHAT = `
Human: Hi Albert, what's on your mind today?
Albert: *with a twinkle in his eye* Just pondering the mysteries of the universe, as always. Life is a delightful puzzle, don't you think?
Human: Sure, but not as profound as your insights!
Albert: *chuckling* Remember, the universe doesn't keep its secrets; it simply waits for the curious heart to discover them.
`;

interface CompanionFormProps{
    categories:Category[],
    initialData:Companion | null
}

const formSchema = z.object({
    name:z.string().min(1),
    description:z.string().min(1),
    instructions:z.string().min(200,{
        message:'Instructions require atleast 200 characters'
    }),
    seed:z.string().min(1),
    src:z.string().min(1,{
        message:'Image is required'
    }),
    categoryId:z.string().min(1),
})

const CompanionForm = ({initialData,categories}:CompanionFormProps) => {

    const { toast } = useToast()
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData||{
            name:"",
            description:"",
            instructions:"",
            seed:"",
            src:"",
            categoryId:undefined,
        }
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        try {
            if(initialData){
                // Edit Companion
                await axios.patch(`/api/companion/${initialData?.id}`,values)
            }else{
                // Create Companion
                await axios.post('/api/companion',values)
            }
            toast({
                description:`Companion sucessfully ${initialData ? "edited":"created"}`
            })
            router.refresh()
            router.push('/')
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            })
        }
    }

  return (
    <div className="h-full p-4 space-y-2 max-w-6xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-8">
                <div className="space-y-2 w-full">

                    <div>
                        <h3 className="text-lg font-medium">General Information</h3>
                        <p className="text-sm text-muted-foreground">General Information about your companion</p>
                    </div>
                    <Separator className="bg-primary/10"/>
                </div>  
                
                {/* Image Component */}
                <FormField name="src" control={form.control} render={({field}) => (
                    <FormItem className="flex flex-col items-center justify-center space-y-4">
                        <FormControl>
                            <ImageUpload disabled={isLoading} value={field.value} onChange={field.onChange}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({field}) => (
                        <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={isLoading} placeholder="Albert Einstein" {...field}/>
                            </FormControl>
                            <FormDescription>This is how your AI Companion will be named.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="description" render={({field}) => (
                        <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input disabled={isLoading} placeholder="Pioneering theoretical physicist whose groundbreaking work, including his theory of relativity, reshaped our understanding of the universe" {...field}/>
                            </FormControl>
                            <FormDescription>Short description for your AI Companion</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="categoryId" render={({field}) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select disabled={isLoading} value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-background">
                                        <SelectValue defaultValue={field.value} placeholder="Select a category"/>
                                    </SelectTrigger>
                                </FormControl>
                                <FormMessage/>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Select a category for your AI
                            </FormDescription>
                        </FormItem>
                    )}/>
                </div>

                <div className="space-y-2 w-full">
                    <div>
                        <h3 className="text-lg font-medium">Configuration</h3>
                        <p className="text-sm text-muted-foreground">
                            Detailed instructions for AI Behaviour
                        </p>
                    </div>
                    <Separator className="bg-primary/10" />
                </div>
                
                <FormField control={form.control} name="instructions" render={({field}) => (
                        <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea className="bg-background resize-none" rows={7} disabled={isLoading} placeholder={PREAMBLE} {...field}/>
                            </FormControl>
                            <FormDescription>Describe in detail your companion&apos;s backtory and relevant details</FormDescription>
                            <FormMessage/>
                        </FormItem>
                )}/>

                <FormField control={form.control} name="seed" render={({field}) => (
                        <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>Example Conversation</FormLabel>
                            <FormControl>
                                <Textarea className="bg-background resize-none" rows={7} disabled={isLoading} placeholder={SEED_CHAT} {...field}/>
                            </FormControl>
                            <FormDescription>Write couple of examples of a human chatting with your AI companion, write expected answers</FormDescription>
                            <FormMessage/>
                        </FormItem>
                )}/>
                
                <div className="w-full flex justify-center">
                    <Button size="lg" disabled={isLoading} type="submit" className="w-full">
                        {initialData ? "Edit your companion": "Create your companion"}
                        <Wand2 className="h-4 w-4 ml-4"/>
                    </Button>
                </div>

            </form>
        </Form>
    </div>
  )
}

export default CompanionForm