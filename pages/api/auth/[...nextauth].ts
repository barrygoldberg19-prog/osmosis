import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const authOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "tweet.read users.read follows.read offline.access",
        },
      },
      userinfo: {
        url: "https://api.twitter.com/2/users/me",
        params: {
          "user.fields": "profile_image_url",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      // Save user to Supabase when they sign in
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          twitter_id: profile.data.id,
          twitter_username: profile.data.username,
          twitter_access_token: account.access_token,
          twitter_refresh_token: account.refresh_token,
          updated_at: new Date().toISOString(),
        })
      
      if (error) console.error('Error saving user:', error)
      return true
    },
    async jwt({ token, user, account, profile }: any) {
      // Store user ID and Twitter data in JWT token
      if (user) {
        token.userId = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile?.data) {
        token.twitterId = profile.data.id
      }
      return token
    },
    async session({ session, token }: any) {
      // Add user ID to session from JWT token
      if (token?.userId) {
        session.user.id = token.userId
      }
      if (token?.twitterId) {
        session.user.twitterId = token.twitterId
      }
      return session
    },
  },
  pages: {
    signIn: '/',
  },
}

export default NextAuth(authOptions)
