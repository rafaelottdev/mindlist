import { useState } from "react"

export const usePasswordToggle = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
        
    const togglePassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setShowPassword(!showPassword)
    }

    return {
        showPassword,
        togglePassword
    }
}
