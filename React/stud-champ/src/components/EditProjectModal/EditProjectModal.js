import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import React, { useState } from 'react';
import './EditProjectModal.css';

function EditProjectModal({isOpen, onClose, projectDetails, setProjectDetails}) {
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        let newProjectName = formData.get('project-name');
        let newProjectDescription = formData.get('project-description');
        let newProjectGitRepoId = formData.get('project-git-repo-id');
        if (newProjectName.length === 0) {
            newProjectName = projectDetails.name;
        }
        if (newProjectDescription.length === 0) {
            newProjectDescription = projectDetails.description;
        }
        if (newProjectGitRepoId.length === 0) {
            newProjectGitRepoId = projectDetails.git_repo_link;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/${projectDetails.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newProjectName,
                    description: newProjectDescription,
                    git_repo_id: newProjectGitRepoId
                })
            });
            const data = await response.json();
            if(data.success) {
                setProjectDetails({
                    name: newProjectName,
                    description: newProjectDescription,
                    git_repo_link: newProjectGitRepoId
                });
                onClose();
            } else {
                setResponseMessage(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setResponseMessage(error.toString());
        }
    };


    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="modal-box">
                <h2 className='modal-box-header'>Edit Project</h2>
                <form noValidate autoComplete="off" className='modal-box-form' onSubmit={handleSubmit}>
                    <h3 className="field-label">Project Name:</h3>
                    <input className='add-team-modal-box-form-content' name="project-name" type="text" placeholder={projectDetails.name}/>
                    <h3 className="field-label">Project Description:</h3>
                    <input className='add-team-modal-box-form-content' name="project-description" type="text" placeholder={projectDetails.description}/>
                    <h3 className="field-label">Project Git Repo Id:</h3>
                    <input className='add-team-modal-box-form-content' name="project-git-repo-id" type="text" placeholder={projectDetails.git_repo_link}/>
                    <div className="add-team-modal-box-form-footer">
                        <Button variant="contained" size="medium" onClick={onClose}>Cancel</Button>
                        <Button variant="containedPrimary" size="medium" type="submit">Edit</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditProjectModal;