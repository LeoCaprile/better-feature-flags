
import NextAuth from "next-auth"
import GitLab from "next-auth/providers/gitlab"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitLab],
})