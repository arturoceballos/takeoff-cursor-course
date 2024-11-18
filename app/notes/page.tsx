'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import dynamic from 'next/dynamic'
import { useHotkeys } from 'react-hotkeys-hook'
import type { UnprivilegedEditor } from 'react-quill'

const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded" />
})
import 'react-quill/dist/quill.snow.css'

interface Note {
  id: string
  content: string
  tags: string[]
  isRichText: boolean
  createdAt: number
}

export default function NoteTakingApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [isRichText, setIsRichText] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const quillRef = useRef<UnprivilegedEditor>(null)

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
    
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Ctrl+N shortcut to focus on input
  useHotkeys('ctrl+n', (e: KeyboardEvent) => {
    e.preventDefault()
    if (isRichText) {
      quillRef.current?.focus()
    } else {
      textareaRef.current?.focus()
    }
  })

  const addNote = () => {
    if (!newNote.trim()) return
    
    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      tags: extractTags(newNote),
      isRichText,
      createdAt: Date.now()
    }
    
    setNotes(prev => [note, ...prev])
    setNewNote('')
  }

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  const updateNote = (id: string, content: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, content, tags: extractTags(content) }
        : note
    ))
    setEditingId(null)
  }

  const extractTags = (content: string): string[] => {
    const matches = content.match(/#[\w-]+/g)
    return matches ? Array.from(new Set(matches)) : []
  }

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'dark:bg-gray-900 dark:text-white' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Note Taking App</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setIsRichText(!isRichText)}
              className="px-4 py-2 rounded bg-blue-500 text-white"
            >
              {isRichText ? 'Switch to Plain Text' : 'Switch to Rich Text'}
            </button>
          </div>

          {isRichText ? (
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={newNote}
              onChange={(content) => setNewNote(content)}
              className="mb-4 bg-white rounded"
            />
          ) : (
            <textarea
              ref={textareaRef}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write your note here... Use #tags for categorization"
              className="w-full p-4 mb-4 border rounded dark:bg-gray-800"
              rows={4}
            />
          )}

          <button
            onClick={addNote}
            className="px-4 py-2 rounded bg-green-500 text-white"
          >
            Add Note
          </button>
        </div>

        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 mb-8 border rounded dark:bg-gray-800"
        />

        <div className="space-y-4">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className="p-4 border rounded dark:bg-gray-800"
            >
              {editingId === note.id ? (
                <div>
                  {note.isRichText ? (
                    <ReactQuill
                      theme="snow"
                      value={note.content}
                      onChange={(content: string) => updateNote(note.id, content)}
                    />
                  ) : (
                    <textarea
                      value={note.content}
                      onChange={(e) => updateNote(note.id, e.target.value)}
                      className="w-full p-2 border rounded dark:bg-gray-700"
                    />
                  )}
                </div>
              ) : (
                <div onClick={() => setEditingId(note.id)}>
                  {note.isRichText ? (
                    <div dangerouslySetInnerHTML={{ __html: note.content }} />
                  ) : (
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                  )}
                </div>
              )}

              <div className="mt-2 flex gap-2">
                {note.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => deleteNote(note.id)}
                className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 