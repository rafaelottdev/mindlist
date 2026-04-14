import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router"

import { usePasswordToggle } from "../../hooks/usePasswordToggle"

import type { User } from "../../types/User"
import { createUser } from "../../services/createUser"
import { getUsers } from "../../services/getUsers"

import styles from "./Register.module.css"

import { FaEye } from "react-icons/fa"
import { FaEyeSlash } from "react-icons/fa"
import { FaClipboardList } from "react-icons/fa"

const passwordRegex: RegExp = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10}$/

function Register() {
    const { showPassword, togglePassword } = usePasswordToggle()
    const navigate = useNavigate()

    const [user, setUser] = useState<User>({
        name: "",
        email: "",
        password: ""
    })
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setUser(prev => ({
            ...prev,
            [name]: value
        }))
    }

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

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)

        try {
            const usersData: User[] = await getUsers()
    
            const nameExists: boolean = usersData.some((u: User) => u.name === user.name)
            const emailExists: boolean = usersData.some((u: User) => u.email === user.email)
            const validPass: boolean = passwordRegex.test(user.password)
    
            if (nameExists) {
                showError("Nome já cadastrado")
                return
            }
    
            if (emailExists) {
                showError("Email já cadastrado")
                return
            }
    
            if (!validPass) {
                showError("Senha muito fraca")
                return
            }
    
            await createUser(user)

            localStorage.setItem("user", JSON.stringify(user));

            showSuccess("Usuário cadastrado com sucesso!")
            
            setUser({name: "", email: "", password: ""})


            setTimeout(() => {
                navigate("/");
            }, 2000);
        } 
        
        catch(error) {
            showError("Erro ao cadastrar usuario")
        } 
        
        finally {
            setLoading(false)
        }

    }

    return (
        <main className={styles.register_main}>
            <section className={styles.page_title_container}>
                <FaClipboardList />
                <h1>
                    <span>Mind</span> List
                </h1>
            </section>

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <form className={styles.register_form} onSubmit={handleSubmit}>
                <h1 className={styles.form_title}>Cadastro</h1>

                <div className={`${styles.name_container} ${styles.input_container}`}>
                    <label htmlFor="name">Nome</label>
                    <input type="text" name="name" id="name" placeholder="Digite seu nome" autoComplete="off" value={user.name}
                        onChange={handleChange} 
                    />
                </div>

                <div className={`${styles.email_container} ${styles.input_container}`}>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder="Cadastre um email" autoComplete="off" value={user.email}
                        onChange={handleChange}
                    />
                </div>

                <div className={`${styles.password_container} ${styles.input_container}`}>
                    <label htmlFor="password">Senha</label>
                    
                    <div className={styles.password}>
                        <input type={`${showPassword ? "text" : "password"}`} name="password" id="password" placeholder="Cadastre uma senha" maxLength={10} minLength={10} autoComplete="off" value={user.password}
                            onChange={handleChange}
                        />
                        
                        <button type="button" onClick={togglePassword}>
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                </div>

                <div className={styles.send_container}>
                    <button disabled={loading}>
                        {loading ? "Cadastrando..." : "Se Cadastrar"}
                    </button>

                    <Link to="/login">Ja tenho uma conta</Link>
                </div>
            </form>
        </main>
    )
}

export default Register
