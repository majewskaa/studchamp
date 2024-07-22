import React, { useState } from 'react';

function AddTaskModal({ isOpen, onClose, subjectId, teamId, authorId }) {
    const [taskDetails, setTaskDetails] = useState({
        title: '',
        description: '',
        points: '',
    });
    const [responseMessage, setResponseMessage] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setTaskDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmitCreateTask = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const title = formData.get('title');
        const description = formData.get('description');
        const points = formData.get('points');
        console.log('title type:', title.type);

        const payload = {
            title: title,
            description: description,
            points: parseInt(points),
            author_id: 1,
            team_id: parseInt(teamId),
            subject_code: subjectId,
        };

        console.log('payload:', payload);

        fetch(API_URL + '/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
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

        handleClose();
        window.location.reload();
    };

    const handleClose = () => {
        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2 className="modal-box-header">Add new Task</h2>
                <form noValidate autoComplete="off" className='modal-box-form' onSubmit={handleSubmitCreateTask}>
                    <input
                        className='modal-box-form-content'
                        name="title"
                        type="text"
                        placeholder="Title"
                        value={taskDetails.title}
                        onChange={handleInputChange}
                    />
                    <textarea
                        className='modal-box-form-content'
                        name="description"
                        placeholder="Description"
                        value={taskDetails.description}
                        onChange={handleInputChange}
                    />
                    <input
                        className='modal-box-form-content'
                        name="points"
                        type="number"
                        placeholder="Points"
                        value={taskDetails.points}
                        onChange={handleInputChange}
                    />
                    <div className="modal-box-form-footer">
                        <button type="button" onClick={handleClose}>Cancel</button>
                        <input type="submit" value="Add"/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTaskModal;