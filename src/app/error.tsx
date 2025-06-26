
"use client" // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
      <PageHeader 
        title="Something Went Wrong"
        subtitle="An unexpected error occurred. Please try again."
      />
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  )
}
