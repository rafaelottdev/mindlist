import { useEffect, useRef, useState } from "react"
import styles from "./MainContent.module.css"
import globalStyles from "../../../styles/projectList.module.css"

import NewProject from "../../../components/NewProject/NewProject";
import { supabase } from "../../../lib/supabase";
import Project from "../../../components/Project/Project";

function MainContent() {
  const [show, setShow] = useState<boolean>(false)
  const [projects, setProjects] = useState<any[]>([])
  const [creatingProject, setCreatingProject] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const fetchProjects = async () => {
      const { data: sessionData  } = await supabase.auth.getSession()
      const user = sessionData.session?.user

      if(!user) return

      const { data, error } = await supabase.from("projects").select("*").eq("user_id", user.id).order("position", { ascending: true })

      if(error) {
        console.log(error)
        return
      }

      setProjects(data)
    }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleClick = () => {
    setShow(!show)
    inputRef.current?.focus()
  }

  return (
    <>
      <section className={globalStyles.projects_section}>
        <ul className={globalStyles.projects_list}>
          {
            projects.map((project) => (
              <Project
                key={project.id}
                id={project.id}
                name={project.name}
                image={project.image_url}
                status={project.status}
                onUpdate={fetchProjects}
              />
            ))
          }

          {
            creatingProject && 
              <li>
                <div className={styles.project_loading}></div>
              </li>
          }

          <li className={styles.create_new_project_item}>
            <button className={styles.create_new_project_btn} onClick={handleClick}>+ Criar novo projeto</button>
            
            <NewProject setCreatingProject={setCreatingProject} show={show} handleClick={handleClick} onProjectCreated={fetchProjects} projects={projects} inputRef={inputRef} />
          </li>
        </ul>
      </section>
    </>
  )
}

export default MainContent
