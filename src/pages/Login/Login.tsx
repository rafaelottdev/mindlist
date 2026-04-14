import { Link } from "react-router"
import { usePasswordToggle } from "../../hooks/usePasswordToggle"

import type { User } from "../../types/User"
import { getUsers } from "../../services/getUsers"

import styles from "./Login.module.css"

import { FaEye } from "react-icons/fa"
import { FaEyeSlash } from "react-icons/fa"
import { FaClipboardList } from "react-icons/fa"
import { useState } from "react"


function Login() {
    const { showPassword, togglePassword } = usePasswordToggle()

    const [user, setUser] = useState<User>({
        name: "",
        email: "",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setUser(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const usersData: User[] = await getUsers()

        const currentUser = usersData.filter((u: User) => u.email === user.email && u.password === user.password)

        console.log(currentUser)
    }

    return (
        <main className={styles.login_main}>
            <section className={styles.page_title_container}>
                <FaClipboardList />
                <h1>
                    <span>Mind</span> List
                </h1>
            </section>

            <form className={styles.login_form} onSubmit={handleSubmit}>
                <h2 className={styles.form_title}>Login</h2>

                <div className={`${styles.email_container} ${styles.input_container}`}>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" placeholder="Digite seu email" autoComplete="off" onChange={handleChange}/>
                </div>

                <div className={`${styles.password_container} ${styles.input_container}`}>
                    <label htmlFor="senha">Senha</label>
                    
                    <div className={styles.password}>
                        <input type={`${showPassword ? "text" : "password"}`} name="password" id="senha" placeholder="Digite sua senha" maxLength={10} autoComplete="off" onChange={handleChange}/>
                        
                        <button onClick={togglePassword}>
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                </div>

                <div className={styles.send_container}>
                    <button>Entrar</button>

                    <Link to="/register">Criar uma conta</Link>
                </div>
            </form>
        </main>
    )
}

export default Login
