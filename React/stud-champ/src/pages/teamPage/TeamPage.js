import './TeamPage.css';
import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import { AuthContext } from '../../security/AuthProvider';
import coinImage from '../../resources/gold-coin.svg';
import { Link } from 'react-router-dom';
import AddProjectModal from '../../components/AddProjectModal';

function TeamPage() {
    let { subject_id, team_id } = useParams();
    const coinCount = 10;

    const [projectsList, setProjectsList] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const { isLoggedIn, setIsLoggedIn, userId } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProfileButtonClicked = () => {
        //
    }

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/projects/' + subject_id + '/' + team_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setResponseMessage(data.message);
            if (data.success) {
                setProjectsList(data.projects);
            }
        })
        .catch((error) => {
            setResponseMessage(error.toString());
            console.error('Error:', error);
        });
    }, [subject_id, team_id]);

    return (
        <div>
            <Header setIsLoggedIn={setIsLoggedIn} handleProfileButtonClicked={handleProfileButtonClicked}/>
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
            <div className="secton-container-projects">
                <div className="section section-large">
                    <h2 className="title">Projects</h2>
                    {projectsList.map((project, index) => (
                        <div className='project-container' key={index}>
                        <Link className='project-title' to={`/subjects/${subject_id}/teams/${team_id}/projects/${project.id}`}>
                            <h3>{project.name}</h3>
                        </Link>
                        </div>
                    ))}
                    <button className="add-project-btn" onClick={() => setIsModalOpen(true)}>Add Project</button>
                </div>
            </div>
            <AddProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} subjectId={subject_id} teamId={team_id} authorId={userId} />
        </div>
    );
}

export default TeamPage;