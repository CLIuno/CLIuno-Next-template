import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="tw:hero tw:min-h-[70vh]">
      <div className="tw:hero-content tw:text-center">
        <div className="tw:max-w-md">
          <h1 className="tw:text-5xl tw:font-bold">CLIuno</h1>
          <p className="tw:py-6">
            A Next.js template wired to the shared CLIuno REST contract — auth, todos, posts and
            follows out of the box.
          </p>
          <Link href="/register" className="tw:btn tw:btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}
