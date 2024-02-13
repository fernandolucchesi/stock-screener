'use client'

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-md mt-20 flex flex-col gap-10 text-center">
      <h2 className="text-xl font-medium">Ops... Something went wrong!</h2>
      <code className="bg-gray-50 border p-5">{error.message}</code>
      <div>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  )
}
