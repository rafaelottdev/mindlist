import styles from "./Task.module.css"

import { FaTrash } from "react-icons/fa";
import { BiSolidPencil } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

type Props = {
    id: number
    title: string
    status: string
    onUpdate: () => void
}

function Task({ id, title, status, onUpdate }: Props) {
    const [completed, setCompleted] = useState<boolean>(status === "completed")
    const [menuTask, setMenuTask] = useState<boolean>(false)
    const [handleChange, setHandleChange] = useState<string>(title)
    const [openInput, setOpenInput] = useState<boolean>(false)

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const loadingGlobalTimer: number = 1000

    const checkTask = async () => {
        const newCompleted = !completed

        setCompleted(newCompleted)

        if(newCompleted) {
            await supabase.from("tasks").update({ status:  "completed" }).eq("id", id)
            
        }

        else {
            await supabase.from("tasks").update({ status:  "active" }).eq("id", id)
        }
    }

    const changeTitleTask = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setIsEditing(true)

        const newTaskTitle = handleChange

        if(!newTaskTitle) {
            setIsEditing(false)
            return
        }

        try {
            await supabase.from("tasks").update({ title: newTaskTitle }).eq("id", id)

            setOpenInput(false)

            onUpdate()
        }

        catch(error) {
            console.log(error)
            setIsEditing(false)
        }

        setTimeout(() => {
            setOpenInput(false)
            setIsEditing(false)
        }, loadingGlobalTimer)

        setHandleChange("")
    }

    const deleteTask = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setIsDeleting(true)

        try {
            await new Promise((resolve) => {
                setTimeout(resolve, loadingGlobalTimer)
            })

            await supabase.from("tasks").delete().eq("id", id)
    
            onUpdate()
        }

        catch(error) {
            console.log(error)
            setIsDeleting(false)
        }

        setIsDeleting(false)
    }

    return (
        <li className={styles.task_item}>
            <div className={styles.task_info}>
                <button onClick={checkTask}>
                    {
                        completed &&
                            <svg viewBox="0 0 4 4">
                                <path d="M2 3.75C2.9665 3.75 3.75 2.9665 3.75 2C3.75 1.0335 2.9665 0.25 2 0.25C1.0335 0.25 0.25 1.0335 0.25 2C0.25 2.9665 1.0335 3.75 2 3.75Z"/>
                                <path d="M2.88334 1.21667L1.75 2.35001L1.28334 1.88334L1.05 2.11667L1.75 2.81667L3.11667 1.45001L2.88334 1.21667Z"/>
                            </svg>
                    }
                </button>
                
                <div>
                    {
                        isEditing ? (
                            <div className={styles.spinner}></div>
                        ) : openInput ? (
                            <form className={styles.form_edit_title} onSubmit={(e) => e.preventDefault()}>
                                <input type="text" maxLength={11} value={handleChange} onChange={(e) => setHandleChange(e.target.value)}/>
                                <button onClick={changeTitleTask}>Editar</button>
                            </form>
                            
                        ) : (
                            <p>{title}</p>
                        )
                    }
                </div>
            </div>

            <div className={styles.task_menu}>
                <button onClick={() => { setMenuTask(!menuTask); setOpenInput(false) }}>
                    <BsThreeDots />
                </button>

                <div className={`${styles.menu_buttons} ${menuTask ? styles.show_menu : styles.hide_menu}`}>
                    <button onClick={() => { setOpenInput(!openInput); setHandleChange("") }}>
                        <BiSolidPencil />
                    </button>

                    <button onClick={deleteTask}>
                        {
                            isDeleting ? <div className={styles.spinner}></div> : <FaTrash />
                        }
                    </button>
                </div>
            </div>
        </li>
    )
}

export default Task
