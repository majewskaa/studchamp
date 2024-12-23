import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import { AuthContext } from '../../security/AuthProvider';
import coinImage from '../../resources/gold-coin.svg';
import { Link } from 'react-router-dom';
import AddTaskModal from '../../components/AddTaskModal';
import Button from '@material-ui/core/Button';
import EditProjectModal from '../../components/EditProjectModal/EditProjectModal';

import './ProjectPage.css';

function ProjectPage() {
    let { subject_id, team_id, project_id } = useParams();
    const coinCount = 10;

    const [tasksList, setTasksList] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const { isLoggedIn, setIsLoggedIn, userId } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectDetails, setProjectDetails] = useState(null);
    const [commits, setCommits] = useState([]);
    const [isBindGitRepoModalOpen, setIsBindGitRepoModalOpen] = useState(false);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [gitRepoLink, setGitRepoLink] = useState('');

    function BindGitRepoModal({ isOpen, onClose}) {
        const handleSubmit = (event) => {
          event.preventDefault();
          const projectID = event.target.projectId.value;
          fetch(`${process.env.REACT_APP_API_URL}/projects/${project_id}/${projectID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            })
            .then(response => response.json())
            .then(data => {
                setResponseMessage(data.message);
                if (data.success) {
                    onClose();
                }
            })
            .catch((error) => {
                setResponseMessage(error.toString());
                console.error('Error:', error);
            });

          onClose(); // Close the modal after submission
        };

        if (!isOpen) return null;

        return (
          <div className="modal">
            <form onSubmit={handleSubmit}>
              <label htmlFor="projectId">Project ID:</label>
              <input type="text" id="projectId" name="projectId" required />
              <button type="submit">Submit</button>
              <button onClick={onClose}>Close</button>
            </form>
          </div>
        );
      }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/projects/${project_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setProjectDetails(data.project);
            } else {
                // Handle the case where fetching project details was not successful
                console.error('Failed to fetch project details:', data.message);
            }
        })
        .catch((error) => {
            console.error('Error fetching project details:', error);
        });
    }, [project_id]);

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/project_page_data/' + project_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setResponseMessage(data.message);
            if (data.success) {
                console.info('Data:', data);
                setTasksList(data.tasks);
                setGitRepoLink(data.url);
            }
            else {
                console.error('Error:', data.message);
            }
        })
        .catch((error) => {
            setResponseMessage(error.toString());
            console.error('Error:', error);
        });
    }, [project_id]);

    useEffect(() => {
        if(projectDetails) {
            fetch(process.env.REACT_APP_API_URL + '/commits/' + projectDetails.git_repo_link, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                setResponseMessage(data.message);
                if (data.success) {
                    setCommits(data.commits);
                }
            })
            .catch((error) => {
                setResponseMessage(error.toString());
                console.error('Error:', error);
            });
        }
    }, [projectDetails]);

    return (
        <div> {(projectDetails) ? (
            <div>
            <Header setIsLoggedIn={setIsLoggedIn}/>
            <div className="underheader">
                <div className='subject-outline'>
                    <Breadcrumb subject={subject_id} team={team_id}/>
                </div>
                <div className="coin-container">
                    <div className="coin-display">
                        <img src={coinImage} alt="Coin"  className='coin-image'/>
                        <span className="coin-count">{coinCount}</span>
                    </div>
                </div>
            </div>
            <div className="project-info">
                <div className="project-info-content">
                    <h2>{projectDetails.name}</h2>
                    <p>{projectDetails.description}</p>
                </div>
                <div className="project-info-buttons">
                    {projectDetails.git_repo_link ? (
                        <a href={gitRepoLink} target="_blank" rel="noopener noreferrer">View Git Repo</a>
                    ) : (
                        <>
                        <Button variant="contained" size="medium" onClick={() => setIsBindGitRepoModalOpen(true)}>Bind Git Repo</Button>
                        <BindGitRepoModal
                            isOpen={isBindGitRepoModalOpen}
                            onClose={() => setIsBindGitRepoModalOpen(false)}
                        />
                        </>
                    )}
                    <Button variant="contained" size="medium" onClick={() => setIsEditProjectModalOpen(true)}>Edit Project</Button> {}
                    <EditProjectModal isOpen={isEditProjectModalOpen} onClose={() => setIsEditProjectModalOpen(false)} projectDetails={projectDetails} setProjectDetails={setProjectDetails} />
                </div>
            </div>
            <div className="project-content-container">
                <div className="section-container">
                    <div className="section section-large">
                        <h2 className="title">Your Tasks</h2>
                        {tasksList.map((task, index) => (
                            <div className='task-container' key={index}>
                            <span className='task-points'>{task.points}</span>
                            <Link className='task-title' to={`/subjects/${subject_id}/teams/${team_id}/projects/${project_id}/tasks/${task.id}`}>
                                <h3>{task.title}</h3>
                            </Link>
                            </div>
                        ))}
                        <Button variant="contained" size="medium" className="add-task-btn" onClick={() => setIsModalOpen(true)}>Add Task</Button>
                    </div>
                <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} subjectId={subject_id} teamId={team_id} authorId={userId} projectId={project_id} />
                </div>
                <div className="section-container">
                    <div className="section section-large">
                        <h2 className="title">Git statistics</h2>
                        <table className="team-stats-table">
                            <thead>
                                <tr>
                                    <th>Member e-mail</th>
                                    <th>Commits</th>
                                </tr>
                            </thead>
                            <tbody>
                            {Object.entries(commits).map(([key, value], index) => (
                            <tr key={index}>
                                <td>{key}</td>
                                <td>{value}</td>
                            </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div> </div>) : (<div/>)}
            </div>
    );
}

export default ProjectPage;