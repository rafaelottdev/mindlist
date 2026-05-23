import { NavLink } from "react-router";

import { useFeedback } from "../../hooks/useFeedback";

import styles from "./Header.module.css"

import { FaClipboardList } from "react-icons/fa"
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { MdOutlineLogout } from "react-icons/md";

function Header() {
    const [userName, setUserName] = useState<string | null>(null)
    const { showError } = useFeedback()
    const [showMenuMobile, setShowMenuMobile] = useState<boolean>(false)
    
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserName(data.user?.user_metadata?.name || null)
        })

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            const name: string | null = session?.user?.user_metadata?.name
            setUserName(name || null)
        })

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    const logoutAccount = async () => {
        const { error } = await supabase.auth.signOut()

        if(error) {
            showError(error.message)
            return
        }
    }

    return (
        <header className={styles.header}>
            <section className={styles.page_title_container}>
                <h1>
                    <span>Mind</span>
                    
                    <span className={styles.page_title_icon}>
                        <FaClipboardList />
                    </span>
                    
                    <span>List</span>
                </h1>
            </section>

            <nav className={styles.nav}>
                <div className={`${styles.menu_container} ${showMenuMobile ? `${styles.showMenuBtn}` : ""}`} onClick={() => setShowMenuMobile(true)}>
                    <i className="bi bi-list"></i>
                </div>

                <ul className={`${styles.nav_list} ${showMenuMobile ? `${styles.showMenu}` : ""}`}>
                    <div className={styles.close_menu_container} onClick={() => setShowMenuMobile(false)}>
                        <i className="bi bi-x-lg"></i>
                    </div>

                    <li className={styles.nav_list_item}>
                        <NavLink to="/" className={({ isActive }) => isActive ? `${styles.active}` : ""}>
                            Home
                        </NavLink>
                    </li>

                    <li className={styles.nav_list_item}>
                        <NavLink to="/inprogress" className={({ isActive }) => isActive ? `${styles.active}` : ""}>
                            Ativas
                        </NavLink>
                    </li>

                    <li className={styles.nav_list_item}>
                        <NavLink to="/completed" className={({ isActive }) => isActive ? `${styles.active}` : ""}>
                            Completas
                        </NavLink>
                    </li>

                    <li className={styles.nav_list_item}>
                        <NavLink to="/canceled" className={({ isActive }) => isActive ? `${styles.active}` : ""}>
                            Canceladas
                        </NavLink>
                    </li>

                    <section className={styles.menu_section_mobile}>
                        <p className={styles.user_name_mobile}>{userName}</p>

                        <button className={styles.logou_btn_mobile} onClick={logoutAccount}>
                            <MdOutlineLogout />
                        </button>
                    </section>
                </ul>
            </nav>

            <section className={styles.menu_section}>
                <p className={styles.user_name}>{userName}</p>

                <button className={styles.logou_btn} onClick={logoutAccount}>
                    <MdOutlineLogout />
                </button>
            </section>
        </header>
    )
}

export default Header
