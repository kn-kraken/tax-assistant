import { signIn } from '@/auth'
import { Button } from './ui/button'

export default function SignInBtn() {
  async function onSubmit(e: any) {
    await signIn('credentials', { email: 'test', password: 'test' })
  }
  return (
    <form action={onSubmit}>
      <Button type="submit" variant="link" className="-ml-2">
        Log In
      </Button>
    </form>
  )
}
