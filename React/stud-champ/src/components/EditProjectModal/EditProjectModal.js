import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

function EditProjectModal({isOpen, onClose, projectDetails, setProjectDetails}) {
    const handleSubmit = (event) => {
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
    };


    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="modal-box">
                <h2 className='modal-box-header'>Edit Project</h2>
                <form noValidate autoComplete="off" className='modal-box-form'>
                    <input className='add-team-modal-box-form-content' name="project-name" type="text" placeholder="New Project Name"/>
                    <input className='add-team-modal-box-form-content' name="project-description" type="text" placeholder="New Project Description"/>
                    <input className='add-team-modal-box-form-content' name="project-git-repo-id" type="text" placeholder="New Project Git Repo Id"/>
                    <div className="add-team-modal-box-form-footer">
                        <Button variant="contained" size="medium" onClick={onClose}>Cancel</Button>
                        <Button variant="containedPrimary" size="medium" type="submit" onClick={handleSubmit}>Edit</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditProjectModal;