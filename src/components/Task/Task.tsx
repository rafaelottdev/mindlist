import styles from "./Task.module.css"

import { FaTrash } from "react-icons/fa";
import { BiSolidPencil } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";

function Task() {
    return (
        <li className={styles.task_list}>
            <div className={styles.task_info}>
                <button></button>
                
                <div>
                    <p>Titulo da Tarefa 1</p>
                </div>
            </div>

            <div className={styles.task_menu}>
                <button>
                    <BsThreeDots />
                </button>

                <div className={styles.menu_buttons}>
                    <button>
                        <BiSolidPencil />
                    </button>

                    <button>
                        <FaTrash />
                    </button>
                </div>
            </div>
        </li>
    )
}

export default Task
