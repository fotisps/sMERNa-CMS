"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function DummyContent() {
  const [contentTypes, setContentTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [contents, setContents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentTypesRes, categoriesRes, tagsRes, contentsRes] = await Promise.all([
          fetch('/api/taxonomy/content-types'),
          fetch('/api/taxonomy/categories'),
          fetch('/api/taxonomy/tags'),
          fetch('/api/content'),
        ]);

        const checkResponse = async (res, entityName) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(`Failed to fetch ${entityName}: ${errorData.error || res.statusText}`);
          }
          return res.json();
        };

        const [contentTypesData, categoriesData, tagsData, contentsData] = await Promise.all([
          checkResponse(contentTypesRes, 'content types'),
          checkResponse(categoriesRes, 'categories'),
          checkResponse(tagsRes, 'tags'),
          checkResponse(contentsRes, 'contents'),
        ]);

        setContentTypes(contentTypesData);
        setCategories(categoriesData);
        setTags(tagsData);
        setContents(contentsData);
      } catch (e) {
        console.error("Error fetching data:", e);
        setError(e.message || "Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <h1 className="text-3xl font-bold mb-4">Dummy Content</h1>
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <h1 className="text-3xl font-bold mb-4">Dummy Content</h1>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-4">Dummy Content</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Content Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contentTypes.map((type: any) => (
            <Card key={type._id}>
              <CardHeader>
                <CardTitle>{type.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category: any) => (
            <Card key={category._id}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{category.description}</p>
                {category.parent && <p>Parent: {category.parent.name}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: any) => (
            <span key={tag._id} className="bg-primary text-primary-foreground px-2 py-1 rounded">
              {tag.name}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contents.map((content: any) => (
            <Card key={content._id}>
              <CardHeader>
                <CardTitle>{content.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{content.body.substring(0, 100)}...</p>
                <p>Author: {content.author.name}</p>
                <p>Type: {content.contentType.name}</p>
                <div className="mt-2">
                  {content.categories.map((cat: any) => (
                    <span key={cat._id} className="bg-secondary text-secondary-foreground px-2 py-1 rounded mr-2">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}