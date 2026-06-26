import { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

interface LaravelValidationErrors {
  [key: string]: string[]
}

interface LaravelErrorResponse {
  message?: string
  errors?: LaravelValidationErrors
}

/**
 * Handles API errors by parsing Laravel's 422 validation errors and mapping them
 * to the react-hook-form instances, or showing a toast for generic errors.
 * 
 * @param error The error caught from a try-catch block (usually AxiosError)
 * @param setError The setError function from react-hook-form
 * @param defaultMessage A fallback message if the error doesn't have a clear message
 * @returns boolean Returns true if it was a validation error, false otherwise
 */
export function handleApiError<T extends Record<string, any>>(
  error: unknown,
  setError?: UseFormSetError<T>,
  defaultMessage = 'Terjadi kesalahan pada server.'
): boolean {
  if (error instanceof AxiosError && error.response) {
    const status = error.response.status
    const data = error.response.data as LaravelErrorResponse

    // 422 Unprocessable Entity (Validation Error)
    if (status === 422 && data.errors) {
      if (setError) {
        // Map backend errors to form fields
        Object.keys(data.errors).forEach((key) => {
          // Laravel array fields usually come as "files.0", map them if needed,
          // but for standard fields, it maps 1:1.
          const messages = data.errors![key]
          if (messages && messages.length > 0) {
            // @ts-ignore - we assume the key maps to a valid field in T
            setError(key as any, {
              type: 'server',
              message: messages[0],
            })
          }
        })
        
        // Show a brief toast as well to indicate a validation failure
        toast.error('Gagal menyimpan. Silakan periksa kembali input Anda.')
      } else {
        // If no setError provided, just show the first validation error in a toast
        const firstError = Object.values(data.errors)[0]?.[0]
        toast.error(firstError ?? data.message ?? 'Validasi gagal.')
      }
      return true
    }

    // Other API errors (401, 403, 500, etc)
    toast.error(data.message ?? defaultMessage)
    return false
  }

  // Network error or other non-Axios error
  const err = error as Error
  toast.error(err.message ?? defaultMessage)
  return false
}
