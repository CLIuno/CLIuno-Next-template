import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

export default function HomePage() {
  return (
    <section className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold tracking-tight">CLIuno</h1>
      <p className="mt-6 max-w-md text-muted-foreground">
        A Next.js template wired to the shared CLIuno REST contract — auth, todos, posts and follows
        out of the box.
      </p>
      <Link href="/register" className={buttonVariants({ size: 'lg', className: 'mt-8' })}>
        Get Started
      </Link>
    </section>
  )
}
