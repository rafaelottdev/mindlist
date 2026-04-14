import { FaHouse } from "react-icons/fa6";
import { RiRefreshFill } from "react-icons/ri";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaCircleXmark } from "react-icons/fa6";
import { NavLink } from "react-router";

import styles from "./Header.module.css"

function Header() {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <ul className={styles.nav_list}>
                    <li className={styles.nav_list_item}>
                        <NavLink to="/">
                            <FaHouse />

                            <div className={styles.h_bar}></div>
                        </NavLink>
                    </li>

                    <li className={styles.nav_list_item}>
                        <NavLink to="/inprogress">
                            <RiRefreshFill />

                            <div className={styles.h_bar}></div>
                        </NavLink>
                    </li>

                    <li className={styles.nav_list_item}>
                        <NavLink to="/completed">
                            <IoIosCheckmarkCircle />

                            <div className={styles.h_bar}></div>
                        </NavLink>
                    </li>

                    <li className={styles.nav_list_item}>
                        <NavLink to="/canceled">
                            <FaCircleXmark />

                            <div className={styles.h_bar}></div>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
