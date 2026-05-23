import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

import Project from "../../components/Project/Project"

import styles from "../../styles/projectList.module.css"

function Completed() {
    const [projects, setProjects] = useState<any[]>([])
        
    const fetchProjects = async () => {
        const { data: sessionData  } = await supabase.auth.getSession()
        const user = sessionData.session?.user

        if(!user) return

        const { data, error } = await supabase.from("projects").select("*").eq("user_id", user.id).eq("status", "completed").order("position", { ascending: true })

        if(error) {
        console.log(error)
        return
        }

        setProjects(data)
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    return (
        <>
            <section className={styles.projects_section}>
                <ul className={styles.projects_list}>
                    {
                        projects.length > 0 ?

                        projects.map((project) => (
                        <Project
                            key={project.id}
                            id={project.id}
                            name={project.name}
                            image={project.image_url}
                            status={project.status}
                            onUpdate={fetchProjects}
                        />
                        )) :

                        <div style={{ 
                            color: "white", 
                            fontSize: "16px", 
                            fontFamily: "Lato", 
                            letterSpacing: "1px",
                            margin: "0 auto"
                        }}>
                            Sem Projetos Completos Por aqui
                        </div>
                    }
                </ul>
            </section>
        </>
    )
}

export default Completed
