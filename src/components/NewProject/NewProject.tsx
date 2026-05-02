import { FaCircleXmark } from "react-icons/fa6";

import styles from "./NewProject.module.css"
import { useState } from "react";
import { supabase } from "../../lib/supabase";

type Props = {
    handleClick: () => void
    onProjectCreated: () => void
    show: boolean
    setCreatingProject: React.Dispatch<React.SetStateAction<boolean>>
}

function NewProject({ handleClick, onProjectCreated, show, setCreatingProject }: Props) {
    const [file, setFile] = useState<File | null>(null)
    const [name, setName] = useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]

        if(!selectedFile) return

        setFile(selectedFile)
    }

    // criar projeto
    const handleCreateProject = async () => {
        if(!file || !name) {
            alert("Projeto incompleto")
            return
        }

        setCreatingProject(true)

        try {
            handleClick()
            
            const { data: sessionData } = await supabase.auth.getSession()
            const user = sessionData.session?.user

            if(!user) return 

            // upload da imagem
            const fileName = `${user.id}/${Date.now()}-${file.name}`

            const { error: uploadError } = await supabase.storage.from("projects").upload(fileName, file)

            if(uploadError) {
                console.log(uploadError)
                return
            }

            // pegar URL publica
            const { data } = supabase.storage.from("projects").getPublicUrl(fileName)

            const imageUrl = data.publicUrl

            // novo
            const { data: lastProjects } = await supabase
            .from("projects")
            .select("position")
            .eq("user_id", user.id)
            .order("position", { ascending: false })
            .limit(1)

            const lastProject = lastProjects?.[0]
            const newPosition = lastProject ? lastProject.position + 1 : 0
            // ------------------------

            // salvar no banco
            const { error: insertError } = await supabase.from("projects").insert({
                name,
                image_url: imageUrl,
                user_id: user.id,
                status: "active",
                position: newPosition
            })

            if(insertError) {
                console.log(insertError)
                return
            }

            onProjectCreated()

            // reset e fechar
            setName("")
            setFile(null)
        }

        catch(error) {
            console.log(error)
        }

        finally {
            setCreatingProject(false)
        }
    }

    return (
        <div className={`${styles.newProject_container} ${show ? styles.show_modal : ""}`}>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateProject() }} className={styles.newProject_form}>
                <div className={styles.upload_image_container}>
                    <label htmlFor="upload">{file ? "Imagem Selecionada" : "Baixar Imagem"}</label>
                    <input type="file" accept="image/*" name="upload" id="upload" style={{display: "none"}} onChange={handleFileChange} />
                </div>

                <div className={styles.project_name}>
                    <input type="text" name="name" id="name" placeholder="Nome do projeto" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className={styles.project_btn_container}>
                    <button type="button" onClick={handleClick}>
                        <FaCircleXmark />
                    </button>
                    
                    <button type="submit">Criar</button>
                </div>
            </form>
        </div>
    )
}

export default NewProject

// fazer cada projeto ser um Link que vai pra uma pagina, cada projeto vai pra uma pagina diferente
