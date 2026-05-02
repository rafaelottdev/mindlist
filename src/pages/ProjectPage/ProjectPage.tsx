import { FaCircleXmark } from "react-icons/fa6";

import styles from "./ProjectPage.module.css"
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useParams } from "react-router";
import List from "../../components/List/List";

function ProjectPage() {
    const [listName, setListName] = useState<string>("")
    const [show, setShow] = useState<boolean>(false)
    const [lists, setLists] = useState<any[]>([])
    const { id } = useParams()

    const inputRef = useRef<HTMLInputElement | null>(null)

    const [creatingList, setCreatingList] = useState<boolean>(false)

    const fetchLists = async () => {
        const { data: sessionData } = await supabase.auth.getSession()
        const user = sessionData.session?.user

        if(!user) return

        const { data, error } = await supabase.from("lists").select("*").eq("project_id", id).order("position", {ascending: true})

        if(error) {
            console.log(error)
            return
        }

        setLists(data)
    }

    const handleCreateList = async () => {
        if(!listName) return

        if(lists.length >= 5) {
            alert("Só é permitido até 5 listas")
            return
        }

        setCreatingList(true)

        try {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000)
            })

            const { data: sessionData } = await supabase.auth.getSession()
            const user = sessionData.session?.user
    
            if(!user) return
    
            const { data: lastLists } = await supabase.from("lists").select("position").eq("project_id", id).order("position", {ascending: false}).limit(1)
    
            const lastList = lastLists?.[0]
            const newPosition = lastList ? lastList.position + 1 : 0
    
            const { error } = await supabase.from("lists").insert({
                title: listName,
                project_id: id,
                user_id: user.id,
                status: "active",
                position: newPosition
            })
    
            if(error) {
                console.log(error)
                return
            }
    
            await fetchLists()
    
            setListName("")
            setShow(false)
        }

        catch(error) {
            console.log(error)
            setCreatingList(false)
        }

        finally {
            setCreatingList(false)
        }
    }

    const handleClick = () => {
        setShow(!show)
        setListName("")
        inputRef.current?.focus()
    }

    useEffect(() => {
        fetchLists()
    }, [])

    return (
        <section className={styles.project_list_section}>
            <ul className={styles.project_list}>
                {
                    lists.map((list) => (
                        <List 
                            key={list.id}
                            id={list.id}
                            title={list.title}
                            status={list.status}
                            onUpdate={fetchLists}
                        />
                    ))
                }

                {
                    creatingList &&
                    <li>
                        <div className={styles.list_loading}></div>
                    </li>
                }

                <li className={styles.project_item}>
                    <button className={styles.add_list_btn} onClick={handleClick}>+ Adicionar Lista</button>

                    <div className={`${styles.create_list_container} ${show ? styles.show_modal : ""}`}>
                        <form onSubmit={(e) => { e.preventDefault(); handleCreateList() }}>
                            <input type="text" value={listName} onChange={(e) => setListName(e.target.value)} maxLength={13} ref={inputRef} />

                            <div className={styles.project_controller}>
                                <button type="submit">Adicionar</button>

                                <button onClick={(e) => { e.preventDefault(); handleClick() }}>
                                    <FaCircleXmark />
                                </button>
                            </div>
                        </form>
                    </div>
                </li>
            </ul>
        </section>
    )
}

export default ProjectPage
