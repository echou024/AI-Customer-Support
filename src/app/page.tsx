'use client'

import { useState, useEffect,useCallback } from 'react'

export default function Home() {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([])
  const [inputText, setInputText] = useState('')
  const [isThinking, setIsThinking] = useState(false);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(-1)
  const [displayedText, setDisplayedText] = useState('')

  const typeEffect = useCallback((text: string, index: number) => {
    if (index < text.length) {
      setDisplayedText((prev) => prev + text.charAt(index))
      setTimeout(() => typeEffect(text, index + 1), 25) // Adjust the timeout for faster/slower typing
    } else {
      setCurrentTypingIndex(-1) // Reset typing index when done
    }
  }, [])

  useEffect(() => {
    if (currentTypingIndex !== -1 && messages[currentTypingIndex]) {
      setDisplayedText('')
      typeEffect(messages[currentTypingIndex].text, 0)
    }
  }, [currentTypingIndex, messages, typeEffect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    // Add user message to chat
    setMessages(prev => [...prev, { text: inputText, isUser: true }])
    setInputText('')
    setIsThinking(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch response')
      }

      const data = await response.json()
      
      // Add bot response to chat
      setMessages(prev => {
        const newMessages = [...prev, { text: data.reply, isUser: false }]
        setCurrentTypingIndex(newMessages.length - 1) // Set the index of the new message
        return newMessages
      })
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { text: 'Sorry, there was an error processing your request.', isUser: false }])
    } finally {
      setIsThinking(false)
    }

  }
  useEffect(() => {
    // Scroll to bottom of message container
    const messageContainer = document.getElementById('message-container')
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight
    }
  }, [messages, isThinking, displayedText])


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-br from-blue-300 to-purple-800 ">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-arial text-sm">
      <div className="flex items-center justify-center mb-8">
  <h1 className="text-4xl font-bold text-white flex items-center title">
    AI Health ChatBot
    <svg className="w-8 h-8 ml-3 inline-block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 8 17 8 17 8Z" fill="white"/>
    </svg>
    </h1>
      </div>
        <div className="bg-white shadow-lg rounded-lg max-w-lg w-full mx-auto bg-opacity-70 chat-container-3d">
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs rounded-lg p-3 ${message.isUser ? 'bg-violet-400 text-white' : 'bg-gray-500'}`}>
                  {index === currentTypingIndex ? displayedText:message.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start animate-bounce">
                <div className="bg-gray-500 text-white rounded-lg p-3 flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
          </div>
           )}
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t input-container">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 border rounded-lg p-2 text-black"
                placeholder="Type your message..."
              />
              <button type="submit" className="bg-violet-400 text-white rounded-lg px-4 py-2">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
      <style jsx>{`
        
        .chat-container-3d {
          box-shadow: 
            0 2px 4px rgba(0,0,0,0.1),
            0 4px 8px rgba(0,0,0,0.1),
            0 8px 16px rgba(0,0,0,0.1),
            0 16px 32px rgba(0,0,0,0.1);
          transform: translateY(-4px);
          transition: all 0.3s ease-in-out;
        }
        .chat-container-3d:hover {
          box-shadow: 
            0 4px 8px rgba(0,0,0,0.12),
            0 8px 16px rgba(0,0,0,0.12),
            0 16px 32px rgba(0,0,0,0.12),
            0 32px 64px rgba(0,0,0,0.12);
          transform: translateY(-6px);

          
          
        }
     
      `}</style>
    </main>
  )
}