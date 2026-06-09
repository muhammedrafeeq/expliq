export default function Loading() {
  return (
    <div className="max-w-page-max-width mx-auto px-gutter py-10 space-y-14 animate-pulse">
      {/* Hero skeleton */}
      <div className="text-center space-y-4 pt-2">
        <div className="h-4 w-40 bg-surface-variant rounded-full mx-auto" />
        <div className="h-10 w-72 bg-surface-variant rounded-xl mx-auto" />
        <div className="h-4 w-96 bg-surface-variant rounded-full mx-auto" />
        <div className="h-10 w-full max-w-md bg-surface-variant rounded-xl mx-auto" />
      </div>

      {/* Categories skeleton */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 sm:h-36 md:h-40 rounded-xl bg-surface-variant" />
        ))}
      </div>

      {/* Featured skeleton */}
      <div className="rounded-xl overflow-hidden border border-outline-variant flex flex-col md:flex-row">
        <div className="md:w-1/2 aspect-video bg-surface-variant" />
        <div className="md:w-1/2 p-8 space-y-4 flex flex-col justify-center">
          <div className="h-3 w-24 bg-surface-variant rounded-full" />
          <div className="h-8 w-full bg-surface-variant rounded-lg" />
          <div className="h-8 w-3/4 bg-surface-variant rounded-lg" />
          <div className="h-4 w-full bg-surface-variant rounded-full" />
          <div className="h-4 w-5/6 bg-surface-variant rounded-full" />
        </div>
      </div>

      {/* Article grid skeleton */}
      <div className="space-y-5">
        <div className="h-5 w-40 bg-surface-variant rounded-full" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-outline-variant overflow-hidden">
              <div className="aspect-video bg-surface-variant" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-20 bg-surface-variant rounded-full" />
                <div className="h-4 w-full bg-surface-variant rounded" />
                <div className="h-4 w-4/5 bg-surface-variant rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
