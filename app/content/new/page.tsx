"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  title: z.string().min(2).max(100),
  body: z.string().min(10),
  contentType: z.string(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
})

export default function NewContent() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [contentTypes, setContentTypes] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      contentType: "",
      categories: [],
      tags: [],
    },
  })

  useEffect(() => {
    const fetchTaxonomyData = async () => {
      const [contentTypesRes, categoriesRes, tagsRes] = await Promise.all([
        fetch("/api/taxonomy/content-types"),
        fetch("/api/taxonomy/categories"),
        fetch("/api/taxonomy/tags"),
      ])
      const [contentTypesData, categoriesData, tagsData] = await Promise.all([
        contentTypesRes.json(),
        categoriesRes.json(),
        tagsRes.json(),
      ])
      setContentTypes(contentTypesData)
      setCategories(categoriesData)
      setTags(tagsData)
    }
    fetchTaxonomyData()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const res = await fetch("/api/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    setIsLoading(false)

    if (res.ok) {
      router.push("/dashboard")
    } else {
      // Handle error
      console.error("Failed to create content")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Content</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormDescription>
                  This is the title of your content.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter content body" {...field} />
                </FormControl>
                <FormDescription>
                  This is the main content of your post.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a content type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contentTypes.map((type: any) => (
                      <SelectItem key={type._id} value={type._id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the type of content you're creating.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categories"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Categories</FormLabel>
                  <FormDescription>
                    Select the categories that apply to this content.
                  </FormDescription>
                </div>
                {categories.map((category: any) => (
                  <FormField
                    key={category._id}
                    control={form.control}
                    name="categories"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={category._id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category._id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, category._id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== category._id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {category.name}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Tags</FormLabel>
                  <FormDescription>
                    Select the tags that apply to this content.
                  </FormDescription>
                </div>
                {tags.map((tag: any) => (
                  <FormField
                    key={tag._id}
                    control={form.control}
                    name="tags"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={tag._id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(tag._id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, tag._id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== tag._id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {tag.name}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Content"}
          </Button>
        </form>
      </Form>
    </div>
  )
}