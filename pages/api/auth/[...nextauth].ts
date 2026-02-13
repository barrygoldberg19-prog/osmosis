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
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      try {
        // Save user to Supabase when they sign in
        const twitterId = profile?.data?.id || account?.providerAccountId
        const twitterUsername = profile?.data?.username || user?.name
        
        const { error } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.email || null,
            name: user.name,
            image: user.image,
            twitter_id: twitterId,
            twitter_username: twitterUsername,
            twitter_access_token: account.access_token,
            twitter_refresh_token: account.refresh_token,
            updated_at: new Date().toISOString(),
          })
        
        if (error) console.error('Error saving user:', error)
      } catch (error) {
        console.error('SignIn callback error:', error)
      }
      return true
    },
    async jwt({ token, user, account, profile }: any) {
      // Store user ID in JWT token
      if (user) {
        token.userId = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile?.data?.id) {
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
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
