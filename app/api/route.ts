import { auth } from '@/auth'
import client from '@/lib/mongodb'
import { Chat } from '@/lib/types'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const userId = url.searchParams.get('userId')

  if (!userId) {
    return new Response(JSON.stringify({ data: [] }), { status: 400 })
  }

  try {
    await client.connect() // Connect to the MongoDB client if not already connected
    const db = client.db('hackyeah') // Replace with your DB name
    const chatsCollection = db.collection<Chat>('userChats')

    const data = await chatsCollection
      .find({ userId }, { projection: { _id: 0 } })
      .toArray()

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    console.error('Error fetching chats:', error)
    return new Response(JSON.stringify({ error: 'Error fetching chats' }), {
      status: 500
    })
  }
}
