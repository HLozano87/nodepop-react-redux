
interface NotificationProps {
  successMessage?: string
  errorMessage?: string
}

export function Notifications ({successMessage, errorMessage}: NotificationProps) {
  return (
    <>
      {errorMessage && (
          <div className="mb-4 rounded-xl bg-red-100 px-4 py-2 text-center text-sm text-red-700">
            {errorMessage}
          </div>
      )}
      {successMessage && (
        <div className="mb-4 rounded-xl bg-green-100 px-4 py-2 text-center text-sm text-green-700">
          {successMessage}
        </div>
      )}
    </>
  )
}