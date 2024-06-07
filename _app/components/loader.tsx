type LoaderProps = {
    className?: string
  }

export default function Loader({className}: LoaderProps) {
    return (
      <div className={className + " flex items-center justify-center"} >
        <div className="h-7 w-7 animate-spin rounded-full border-4 border-gray-900 border-t-transparent dark:border-gray-50" />
      </div>
    )
  }