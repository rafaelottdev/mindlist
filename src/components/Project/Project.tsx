import { Link } from "react-router"
import { supabase } from "../../lib/supabase";
 
import styles from "./Project.module.css"

import { RiRefreshFill } from "react-icons/ri";
import { FaCircleXmark } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";

type Props = {
    id: string
    name: string
    image: string
    status: string
    onUpdate: () => void
}

function Project({ id, name, image, status, onUpdate }: Props) {

    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setIsDeleting(true)

        try {
            const { error } = await supabase.from("projects").delete().eq("id", id)
    
            if(error) {
                console.log(error)
                return
            }
    
            onUpdate()
        }

        catch(error) {
            console.log(error)
            setIsDeleting(false)
        }

    }

    const handleUpdateStatus = async (newStatus: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const { error } = await supabase.from("projects").update({ status: newStatus }).eq("id", id)

        if(error) {
            console.log(error)
            return
        }

        onUpdate()
    }

    return (
        <li className={styles.project_item}>
            <Link to={`/project/${id}`} className={styles.project_link}>
                <div className={styles.project_img_wrapp} style={{ backgroundImage: `url(${image})` }}></div>

                <div className={styles.project_info}>
                    <p>{name}</p>

                    <ul className={styles.project_info_list}>
                        <li>
                            <button onClick={(e) => handleUpdateStatus("active", e)} className={`${status === "active" ? styles.active : ""}`}>
                                <RiRefreshFill />
                            </button>
                        </li>

                        <li>
                            <button onClick={(e) => handleUpdateStatus("canceled", e)} className={`${status === "canceled" ? styles.canceled : ""}`}>
                                <FaCircleXmark />
                            </button>
                        </li>

                        <li>
                            <button onClick={(e) => handleUpdateStatus("completed", e)} className={`${status === "completed" ? styles.completed : ""}`}>
                                <FaCircleCheck />
                            </button>
                        </li>
                    </ul>

                    <button className={styles.project_trash_btn} onClick={handleDelete}>
                        {isDeleting ? (
                            <div className={styles.spinner}></div>
                        ) : (
                            <FaTrash />
                        )}
                    </button>
                </div>
            </Link>
        </li>
    )
}

export default Project
