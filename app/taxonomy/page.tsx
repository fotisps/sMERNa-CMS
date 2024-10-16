"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

const contentTypeSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
})

const categorySchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
  parent: z.string().optional(),
})

const tagSchema = z.object({
  name: z.string().min(2).max(30),
})

export default function TaxonomyManagement() {
  const [contentTypes, setContentTypes] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [editingItem, setEditingItem] = useState(null)

  const contentTypeForm = useForm<z.infer<typeof contentTypeSchema>>({
    resolver: zodResolver(contentTypeSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const categoryForm = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      parent: "",
    },
  })

  const tagForm = useForm<z.infer<typeof tagSchema>>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    fetchTaxonomyData()
  }, [])

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

  const onContentTypeSubmit = async (values: z.infer<typeof contentTypeSchema>) => {
    const url = editingItem ? `/api/taxonomy/content-types/${editingItem._id}` : "/api/taxonomy/content-types"
    const method = editingItem ? "PUT" : "POST"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    if (res.ok) {
      fetchTaxonomyData()
      contentTypeForm.reset()
      setEditingItem(null)
    }
  }

  const onCategorySubmit = async (values: z.infer<typeof categorySchema>) => {
    const url = editingItem ? `/api/taxonomy/categories/${editingItem._id}` : "/api/taxonomy/categories"
    const method = editingItem ? "PUT" : "POST"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    if (res.ok) {
      fetchTaxonomyData()
      categoryForm.reset()
      setEditingItem(null)
    }
  }

  const onTagSubmit = async (values: z.infer<typeof tagSchema>) => {
    const url = editingItem ? `/api/taxonomy/tags/${editingItem._id}` : "/api/taxonomy/tags"
    const method = editingItem ? "PUT" : "POST"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    if (res.ok) {
      fetchTaxonomyData()
      tagForm.reset()
      setEditingItem(null)
    }
  }

  const onDelete = async (type: string, id: string) => {
    const res = await fetch(`/api/taxonomy/${type}/${id}`, {
      method: "DELETE",
    })
    if (res.ok) {
      fetchTaxonomyData()
    }
  }

  const onEdit = (item: any, type: string) => {
    setEditingItem(item)
    if (type === 'content-types') {
      contentTypeForm.reset(item)
    } else if (type === 'categories') {
      categoryForm.reset(item)
    } else if (type === 'tags') {
      tagForm.reset(item)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Taxonomy Management</h1>
      <Tabs defaultValue="content-types">
        <TabsList>
          <TabsTrigger value="content-types">Content Types</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>
        <TabsContent value="content-types">
          <Card>
            <CardHeader>
              <CardTitle>Content Types</CardTitle>
              <CardDescription>Manage content types for your CMS</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...contentTypeForm}>
                <form onSubmit={contentTypeForm.handleSubmit(onContentTypeSubmit)} className="space-y-8">
                  <FormField
                    control={contentTypeForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter content type name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contentTypeForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">{editingItem ? 'Update' : 'Add'} Content Type</Button>
                </form>
              </Form>
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Existing Content Types</h3>
                <ul>
                  {contentTypes.map((type: any) => (
                    <li key={type._id} className="flex items-center justify-between mb-2">
                      <span>{type.name}</span>
                      <div>
                        <Button variant="outline" size="sm" onClick={() => onEdit(type, 'content-types')} className="mr-2">Edit</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the content type.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete('content-types', type._id)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Manage categories for your content</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...categoryForm}>
                <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-8">
                  <FormField
                    control={categoryForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={categoryForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={categoryForm.control}
                    name="parent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a parent category (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {categories.map((category: any) => (
                              <SelectItem key={category._id} value={category._id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">{editingItem ? 'Update' : 'Add'} Category</Button>
                </form>
              </Form>
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Existing Categories</h3>
                <ul>
                  {categories.map((category: any) => (
                    <li key={category._id} className="flex items-center justify-between mb-2">
                      <span>{category.name}</span>
                      <div>
                        <Button variant="outline" size="sm" onClick={() => onEdit(category, 'categories')} className="mr-2">Edit</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the category.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete('categories', category._id)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Manage tags for your content</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...tagForm}>
                <form onSubmit={tagForm.handleSubmit(onTagSubmit)} className="space-y-8">
                  <FormField
                    control={tagForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter tag name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">{editingItem ? 'Update' : 'Add'} Tag</Button>
                </form>
              </Form>
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Existing Tags</h3>
                <ul>
                  {tags.map((tag: any) => (
                    <li key={tag._id} className="flex items-center justify-between mb-2">
                      <span>{tag.name}</span>
                      <div>
                        <Button variant="outline" size="sm" onClick={() => onEdit(tag, 'tags')} className="mr-2">Edit</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the tag.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete('tags', tag._id)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}