import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        return {
          id: '1',
          email: 'marek@o2.pl',
          password: '123',
          name: 'Marek Kowalski',
          salt: '123'
        }
      }
    })
  ]
})
