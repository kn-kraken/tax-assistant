'use server'
import client from '@/lib/mongodb' // The MongoClient instance

import { auth } from '@/auth'
import { Author, Chat, Message } from '@/lib/types'
import { redirect, RedirectType } from 'next/navigation'
import { revalidatePath, revalidateTag } from 'next/cache'
import { nanoid } from '@/lib/utils'

// ** Get all chats for a user **
export async function getChats(userId?: string | null) {
  const url = new URL(process.env.NEXT_PUBLIC_URL + '/api/')
  if (userId) {
    url.searchParams.append('userId', userId)
  }

  return (await (await fetch(url.toString())).json()) as Chat[]
}

export async function addChat(name: string, chatPath: string) {
  const session = await auth()

  try {
    await client.connect()
    const db = client.db('hackyeah') // Replace with your DB name
    const chatsCollection = db.collection<Chat>('userChats')

    // Insert a new chat
    await chatsCollection.insertOne({
      id: nanoid(),
      name,
      userId: session!.user!.id,
      messages: []
    })
  } catch (error) {
    console.error('Error adding chat:', error)
    return { error: 'Error adding chat' }
  }
}

export async function addMessageDB(chatId: string, message: Message) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return
  }

  try {
    await client.connect()
    const db = client.db('hackyeah') // Replace with your DB name
    const chatsCollection = db.collection<Chat>('userChats')

    const chat = await chatsCollection.findOne({ id: chatId, userId })

    const updatedMessages = [...chat!.messages, message]

    // Update the chat in the database with the new message
    await chatsCollection.updateOne(
      { id: chatId, userId },
      { $set: { messages: updatedMessages } }
    )
  } catch (error) {
    console.error('Error adding message:', error)
    return { error: 'Error adding message' }
  }
}

// ** Get a single chat by ID **
export async function getChat(id: string, userId: string) {
  const session = await auth()

  try {
    await client.connect()
    const db = client.db('hackyeah') // Replace with your DB name
    const chatsCollection = db.collection<Chat>('userChats')
    const chat = await chatsCollection.findOne(
      { id, userId },
      { projection: { _id: 0 } }
    )

    if (!chat) {
      return null
    }
    return chat
  } catch (error) {
    console.error('Error fetching chat:', error)
    return null
  }
}

// ** Remove a chat by ID **
export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await auth()

  try {
    await client.connect()
    const db = client.db('hackyeah')
    const chatsCollection = db.collection<Chat>('userChats')

    // Find the chat and check if it belongs to the user
    const chat = await chatsCollection.findOne({
      id,
      userId: session!.user!.id
    })

    if (!chat) {
      return { error: 'Chat not found or unauthorized' }
    }

    await revalidatePath('/')
    await chatsCollection.deleteOne({ id, userId: session!.user!.id })
  } catch (error) {
    console.error('Error removing chat:', error)
    return { error: 'Error removing chat' }
  }
}

// ** Clear all chats for a user **
export async function clearChats() {
  const session = await auth()

  try {
    await client.connect()
    const db = client.db('hackyeah')
    const chatsCollection = db.collection<Chat>('userChats')

    // Delete all chats for the user
    await chatsCollection.deleteMany({ userId: session!.user!.id })

    // Revalidate or redirect after clearing chats
    await revalidatePath('/', 'layout')
    return redirect('/')
  } catch (error) {
    console.error('Error clearing chats:', error)
    return { error: 'Error clearing chats' }
  }
}

// ** Refresh history for a specific path **
export async function refreshHistory(path: string) {
  redirect(path)
}

// ** Check for missing environment variables **
export async function getMissingKeys() {
  const keysRequired: string[] = ['MONGODB_URI']
  return keysRequired
    .map(key => (process.env[key] ? '' : key))
    .filter(key => key !== '')
}
