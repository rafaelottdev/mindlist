import styles from "./List.module.css"

import { FaTrash } from "react-icons/fa";
import { BiSolidPencil } from "react-icons/bi";
import { FaCircleXmark } from "react-icons/fa6";
import Task from "../Task/Task";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Props = {
    id: number
    title: string
    status: string
    onUpdate: () => void
}

function List({ id, title, status, onUpdate }: Props) {
    const [completed, setCompleted] = useState<boolean>(status === "completed")
    const [openInput, setOpenInput] = useState<boolean>(false)
    const [handleChange, setHandleChange] = useState<string>(title)
    const [taskForm, setTaskForm] = useState<boolean>(false)

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const loadingGlobalTimer: number = 1000

    const checkList = async () => {
        const newCompleted = !completed

        setCompleted(newCompleted)

        if(newCompleted) {
            await supabase.from("lists").update({ status:  "completed" }).eq("id", id)
            console.log("completed")
            
        }

        else {
            await supabase.from("lists").update({ status:  "active" }).eq("id", id)
            console.log("active")
        }
    }

    const changeTitleList = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setIsEditing(true)

        const newListTitle = handleChange

        try {
            await supabase.from("lists").update({ title: newListTitle }).eq("id", id)

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
    }

    const deleteList = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setIsDeleting(true)

        try {
            await new Promise((resolve) => {
                setTimeout(resolve, loadingGlobalTimer)
            })
            
            await supabase.from("lists").delete().eq("id", id)

            onUpdate()
        }

        catch(error) {
            console.log(error)
            setIsDeleting(false)
        }

        setIsDeleting(false)
        
    }

    useEffect(() => {
        onUpdate()
    }, [])

    return (
        <li className={styles.list_item}>
            <div className={styles.list_header}>
                <div className={styles.header_info}>
                    <button onClick={checkList}>
                        {completed && 
                            <svg viewBox="0 0 4 4">
                                <path d="M2 3.75C2.9665 3.75 3.75 2.9665 3.75 2C3.75 1.0335 2.9665 0.25 2 0.25C1.0335 0.25 0.25 1.0335 0.25 2C0.25 2.9665 1.0335 3.75 2 3.75Z"/>
                                <path d="M2.88334 1.21667L1.75 2.35001L1.28334 1.88334L1.05 2.11667L1.75 2.81667L3.11667 1.45001L2.88334 1.21667Z"/>
                            </svg>
                        }
                    </button>

                    {
                        isEditing ? (
                            <div className={styles.spinner}></div>
                        ) : openInput ? (
                            <form className={styles.form_edit_title} onSubmit={(e) => e.preventDefault()}>
                                <input type="text" maxLength={11} value={handleChange} onChange={(e) => setHandleChange(e.target.value)}/>
                                <button onClick={changeTitleList}>Editar</button>
                            </form>
                            
                        ) : (
                            <p>{title}</p>
                        )
                    }
                </div>

                <div className={styles.header_menu}>
                    <button onClick={() => setOpenInput(!openInput)}>
                        <BiSolidPencil />
                    </button>
                    
                    <button onClick={deleteList}>
                        {
                            isDeleting ? <div className={styles.spinner}></div> : <FaTrash />
                        }
                        
                    </button>
                </div>
            </div>

            <ul className={styles.task_list}>
                {/* <Task /> */}
            </ul>

            <div className={styles.add_task_container}>
                <button onClick={() => setTaskForm(!taskForm)}>+ Adicionar Tarefa</button>

                <form className={`${styles.add_task_form} ${taskForm ? styles.show_task_form : styles.hide_task_form}`}>
                    <div className={styles.input_container}>
                        <textarea maxLength={20}/>
                    </div>

                    <div className={styles.add_task_buttons}>
                        <button type="submit">Adicionar</button>

                        <button>
                            <FaCircleXmark />
                        </button>
                    </div>
                </form>
            </div>
        </li>
    )
}

export default List
