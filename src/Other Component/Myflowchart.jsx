import React, { useContext, useEffect, useState } from 'react'
import "./style2.css"
import MainNavbar from './MainNavbar'
import axios from "axios"
import { useHistory } from "react-router-dom"
import { UserContext } from '../App'
import DeleteIcon from '@material-ui/icons/Delete';

const Popup = ({ setpopup, userAuth }) => {

    const history = useHistory();
    const { user, projectname, setprojectname } = useContext(UserContext);
    const createNewProject = async (e) => {
        e.preventDefault();

        const newproject = await axios.post(`${process.env.REACT_APP_API_KEY}/createNewProject`, { email: user.email, projectname: projectname, elements: "[]" });
        setpopup(false);
        userAuth();
    }
    return (
        <div id="popup_message">
            <div className="take_input_popup">
                <button className="button1 crossButton" onClick={() => setpopup(false)}>x</button>
                <div className="input_field">
                    <h3>Project Name</h3>
                    <input type="text" onChange={(e) => setprojectname(e.target.value)} style={{ padding: '10px 15px' }} />
                </div>
                <button className="button1" onClick={createNewProject} >Create</button>
            </div>
        </div>
    )
}
const ProjectCards = ({ item, userAuth }) => {
    const history = useHistory();
    const {user, projectname, setprojectname, projectdata, setprojectdata , projectId,setprojectId} = useContext(UserContext);
    const openProject = async (e) => {
        e.preventDefault();
        const newdata = await axios.get(`${process.env.REACT_APP_API_KEY}/flowchart/${item._id}`);
        // setprojectdata()
        const data = await newdata.data;
        await setprojectdata(data.projectData);
        await localStorage.setItem('projectId',data.projectData[0]._id);
        await localStorage.setItem('projectDetails',JSON.stringify(data.projectData))
        await localStorage.setItem('projectName',data.projectData[0].projectname);
        await setprojectId(data.projectData[0]._id);
        await setprojectname(data.projectData[0].projectname);
        history.push(`/flowchart/${item.projectname}`);
    }
    const deleteProject = async () => {
        const output = await window.confirm('Are you sure');
        if(!output)return;
        const data = await axios.delete(`${process.env.REACT_APP_API_KEY}/flowchart/${item._id}`);
        userAuth();
    }
    return (<div style={{position: 'relative'}}>
        <div className="projectcard" onClick={openProject} >
            <h3 className="title-heading">{item.projectname}</h3>
        </div>
        <DeleteIcon onClick={deleteProject} class="delete-icon" />
    </div>
    )
}
function Myflowchart() {
    const { user, projectname, setprojectname, loading,setloading } = useContext(UserContext);
    const [popup, setpopup] = useState(false);
    const history = useHistory();
    const [UserProjects, setUserProjects] = useState([]);
    const userAuth = async () => {
        
        try {
            const output = await axios.get(`${process.env.REACT_APP_API_KEY}/getMyFlowcharts/${user.email}`);
            const output2 = await output.data;
            
            if (output.status !== 200) {
                throw new Error;
            }
            setUserProjects(output2.projects)
            
        }
        catch (err) {
            history.push('/login');
        }
        
    }
    useEffect(() => {
        userAuth();
    }, [])

    return (
        <div>
            {popup === true ? <Popup setpopup={setpopup} userAuth={userAuth} /> : null}
            <MainNavbar />
            <div className="container-w100">
                <div className="projects">
                    <center><h1 className="title-heading" style={{color: 'black', textTransform: 'uppercase'}} >My FlowCharts</h1></center>
                    <div className="wrapper">
                        <div className="projectcard add-project" onClick={() => setpopup(true)} >
                            <span className="title-heading">+</span>
                            <h3 className="title-heading">Create new project</h3>
                        </div>

                        {
                            UserProjects.map((item) => (
                                <ProjectCards item={item} userAuth={userAuth} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Myflowchart
