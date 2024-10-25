'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { authClient } from '@/lib/auth-client'
import { MessageSquare, Send } from 'lucide-react'

interface Comment {
  id: string
  project_id: string
  user_id: string
  parent_id: string | null
  content: string
  created_at: string
  replies?: Comment[]
  name: string
}

interface CommentProps {
  projectId: string
}

export default function CommentSection({ projectId }: CommentProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState<string>('')
  const [replyComment, setReplyComment] = useState<string>('') 
  const [error, setError] = useState<string>('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const { data: session } = authClient.useSession()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get<Comment[]>(`/api/comments/${projectId}`)
        setComments(response.data)
      } catch (err) {
        setError(`Error loading comments: ${err}`)
      }
    }
    fetchComments()
  }, [projectId])

  const handlePostComment = async (parentId: string | null = null) => {
    if (!session?.user.id || !session?.user.name) {
      setError('You need to be signed in to post a comment.')
      return
    }
    if (!newComment && !replyComment) return
  
    setLoading(true)
    const content = parentId ? replyComment : newComment
  
    try {
      await axios.post(`/api/comments`, {
        project_id: projectId,
        parent_id: parentId,
        content: content,
        name: session.user.name,
        user_id: session.user.id,
      })
  
      const response = await axios.get<Comment[]>(`/api/comments/${projectId}`)
      setComments(response.data)
  
      setNewComment('')
      setReplyComment('')
      setReplyingTo(null)
    } catch (err) {
      console.error(err)
      setError('Error posting comment')
    } finally {
      setLoading(false)
    }
  }
  
  

  const updateCommentReplies = (comments: Comment[], parentId: string, newReply: Comment): Comment[] => {
    return comments.map(comment => {
      if (comment.id === parentId) {
        return { ...comment, replies: [newReply, ...(comment.replies || [])] }
      }
      if (comment.replies) {
        return { ...comment, replies: updateCommentReplies(comment.replies, parentId, newReply) }
      }
      return comment
    })
  }

  const renderComments = (comments: Comment[], level: number = 0) => {
    return comments.map((comment) => (
      <div key={comment.id} className={`my-4 ${level > 0 ? 'ml-8' : ''} bg-custom-500 rounded-lg shadow-sm`}>
        <div className="flex items-start">
          <div className="flex-1">
            <p className="font-semibold text-white">{comment.name || 'Anonymous'}</p>
            <p className="text-sm text-custom-200">{new Date(comment.created_at).toLocaleString()}</p>
            <p className="mt-2 text-white">{comment.content}</p>
            <button 
              onClick={() => setReplyingTo(comment.id)}
              className="mt-2 text-sm text-custom-200 hover:text-white"
              disabled={loading}  // Disable reply button during loading
            >
              {loading && replyingTo === comment.id ? "Posting..." : "Reply"}
            </button>
            {replyingTo === comment.id && (
              <div className="mt-4">
                <textarea
                  placeholder="Write a reply..."
                  value={replyComment}
                  onChange={(e) => setReplyComment(e.target.value)}
                  className="w-full p-2 bg-custom-500 text-white border border-custom-400 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-300"
                  rows={3}
                />
                <div className="mt-2 flex justify-end space-x-2">
                  <button 
                    onClick={() => setReplyingTo(null)}
                    className="px-4 py-2 text-sm bg-custom-500 text-white border border-custom-400 rounded-md hover:bg-custom-400 focus:outline-none focus:ring-2 focus:ring-custom-300"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handlePostComment(comment.id)}
                    className="px-4 py-2 text-sm bg-white text-black border border-custom-400 rounded-md hover:scale-105 duration-500"
                    disabled={loading}  // Disable post button during loading
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {comment.replies && renderComments(comment.replies, level + 1)}
      </div>
    ))
  }

  return (
    <div className="max-w-3xl p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
        <MessageSquare className="mr-2" />
        Comments
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
        {!session && <p className='py-2 text-gray-400'>Please Sign In to comment.</p>}
      <div className="mb-8 bg-[#1c1c21] rounded-lg shadow-sm p-4">
        <textarea
          disabled={!session}
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="rounded-lg w-full p-2 bg-[#25252b] text-white border-[#35353d] focus:border-[#4d4d57] focus:ring-[#4d4d57]"
          rows={2}
        />
        <div className="flex justify-end mt-2">
          <button 
            onClick={() => handlePostComment()} 
            disabled={!newComment || loading}
            className="btn-primary flex items-center justify-center cursor-pointer"
          >
            <Send className="mr-2 h-4 w-4" /> {loading ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>
      <div>{renderComments(comments)}</div>
    </div>
  )
}
