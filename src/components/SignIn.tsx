import { signIn } from "@/auth"
 
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("gitlab")
      }}
    >
      <button type="submit">Signin with GitLab</button>
    </form>
  )
} 