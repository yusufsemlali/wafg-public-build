"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Plus, Edit, Trash, RefreshCw } from "lucide-react"

interface NewsPost {
  id: number
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  tags: string[]
}

export function AdminNewsManagement() {
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null)

  // Form states
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")

  const fetchNewsPosts = async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      // In a real app, you would fetch from your Supabase table
      // For now, we'll use mock data
      const mockPosts: NewsPost[] = [
        {
          id: 1,
          title: "New Map Rotation Added",
          excerpt: "We've added some classic maps back into the rotation based on community feedback.",
          content:
            "Based on the recent community survey, we've decided to bring back some classic maps that many of you have been missing. Starting today, you'll find de_aztec, de_cbble, and cs_italy in our map rotation server.",
          date: "2023-06-05",
          author: "Admin",
          tags: ["Maps", "Server Update"],
        },
        {
          id: 2,
          title: "Community Tournament Results",
          excerpt: "Congratulations to Team Nostalgia for winning our monthly tournament!",
          content:
            "Our May tournament concluded last weekend with an exciting final between Team Nostalgia and The Headhunters. After three intense maps, Team Nostalgia emerged victorious with a 2-1 score.",
          date: "2023-05-28",
          author: "Admin",
          tags: ["Tournament", "Community Event"],
        },
        {
          id: 3,
          title: "Server Maintenance Complete",
          excerpt: "All servers have been updated with the latest security patches.",
          content:
            "We've completed our scheduled maintenance on all four servers. This update includes the latest security patches, performance optimizations, and some minor bug fixes.",
          date: "2023-05-20",
          author: "Admin",
          tags: ["Maintenance", "Server Update"],
        },
      ]

      setNewsPosts(mockPosts)
    } catch (error) {
      console.error("Error fetching news posts:", error)
      toast({
        title: "Error",
        description: "Failed to load news posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNewsPosts()
  }, [])

  const filteredPosts = newsPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const resetForm = () => {
    setTitle("")
    setExcerpt("")
    setContent("")
    setTags("")
  }

  const openCreateDialog = () => {
    resetForm()
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (post: NewsPost) => {
    setSelectedPost(post)
    setTitle(post.title)
    setExcerpt(post.excerpt)
    setContent(post.content)
    setTags(post.tags.join(", "))
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (post: NewsPost) => {
    setSelectedPost(post)
    setIsDeleteDialogOpen(true)
  }

  const handleCreatePost = async () => {
    try {
      // In a real app, you would insert into your Supabase table
      const newPost: NewsPost = {
        id: newsPosts.length + 1,
        title,
        excerpt,
        content,
        date: new Date().toISOString().split("T")[0],
        author: "Admin",
        tags: tags.split(",").map((tag) => tag.trim()),
      }

      setNewsPosts([newPost, ...newsPosts])
      setIsCreateDialogOpen(false)
      resetForm()

      toast({
        title: "News post created",
        description: "Your news post has been published",
      })
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "Failed to create news post",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePost = async () => {
    if (!selectedPost) return

    try {
      // In a real app, you would update your Supabase table
      const updatedPost: NewsPost = {
        ...selectedPost,
        title,
        excerpt,
        content,
        tags: tags.split(",").map((tag) => tag.trim()),
      }

      setNewsPosts(newsPosts.map((post) => (post.id === selectedPost.id ? updatedPost : post)))
      setIsEditDialogOpen(false)
      resetForm()

      toast({
        title: "News post updated",
        description: "Your news post has been updated",
      })
    } catch (error) {
      console.error("Error updating post:", error)
      toast({
        title: "Error",
        description: "Failed to update news post",
        variant: "destructive",
      })
    }
  }

  const handleDeletePost = async () => {
    if (!selectedPost) return

    try {
      // In a real app, you would delete from your Supabase table
      setNewsPosts(newsPosts.filter((post) => post.id !== selectedPost.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "News post deleted",
        description: "Your news post has been deleted",
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete news post",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search news posts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchNewsPosts}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Create News Post
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>News Posts</CardTitle>
          <CardDescription>Manage community news and announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading news posts...
                  </TableCell>
                </TableRow>
              ) : filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No news posts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-muted-foreground">{post.excerpt.substring(0, 60)}...</div>
                    </TableCell>
                    <TableCell>{post.date}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(post)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(post)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create News Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create News Post</DialogTitle>
            <DialogDescription>Create a new news post or announcement for the community</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the post"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Full post content"
                rows={8}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Comma-separated tags (e.g. News, Update, Event)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePost}>Publish Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit News Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit News Post</DialogTitle>
            <DialogDescription>Update an existing news post</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-excerpt">Excerpt</Label>
              <Input id="edit-excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea id="edit-content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-tags">Tags</Label>
              <Input id="edit-tags" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePost}>Update Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete News Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this news post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedPost && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium">{selectedPost.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedPost.excerpt}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePost}>
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
