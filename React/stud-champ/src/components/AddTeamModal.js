import React, { useState } from 'react';

function AddTeamModal({ isOpen, onClose, groupId }) {
    const [teamMembers, setTeamMembers] = useState(['']);
    const [responseMessage, setResponseMessage] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;

    const handleInputChange = (index, event) => {
        const newTeamMembers = [...teamMembers];
        newTeamMembers[index] = event.target.value;
        setTeamMembers(newTeamMembers);

        if (index === teamMembers.length - 1 && teamMembers.length < 10 && event.target.value !== '') {
            setTeamMembers([...newTeamMembers, '']);
        }
    };

    const handleSubmmitCreateTeam = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const teamName = formData.get('team-name');
        let teamMembers = [];
        for (let i = 0; i < teamMembers.length; i++) {
            const teamMember = formData.get(`team-member-${i}`);
            if(teamMember.length > 0) {
                teamMembers.push(teamMember);
            }
        }

        const payload = {
            name: teamName,
            group_code: groupId,
            users: teamMembers,
        };

        fetch(API_URL + '/teams', {
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
        window.location.reload();
    }

    const handleClose = () => {
        setTeamMembers(['']);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2 className="modal-box-header">Add new Team</h2>
                <form noValidate autoComplete="off" className='modal-box-form' onSubmit={handleSubmmitCreateTeam}>
                    <input className='modal-box-form-content' name="team-name" type="text" placeholder="Team Name"/>
                    {teamMembers.map((member, index) => (
                        <input
                            key={index}
                            className='modal-box-form-content'
                            name={`team-member-${index}`}
                            type="text"
                            placeholder={`Team Member #${index + 1}`}
                            value={member}
                            onChange={(event) => handleInputChange(index, event)}
                        />
                    ))}
                    <div className="modal-box-form-footer">
                        <button type="button" onClick={handleClose}>Cancel</button>
                        <input type="submit" value="Add"/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTeamModal;