import { useRef, useState } from "react"

export const useFeedback = () => {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    
    const showError = (message: string) => {
        setSuccess(null)
        setError(message)

        if(timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            setError(null)
        }, 1500)
    }

    const showSuccess = (message: string) => {
        setError(null)
        setSuccess(message)

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setSuccess(null);
        }, 1500);
    }

    return { error, success, showError, showSuccess }
}
