import React, {useEffect} from 'react';
import { GiCrossedBones } from "react-icons/gi";
import avatar from '../../resources/avatar.png';
import './ChoosenList.css';

function ChoosenList({ selected, setSelected }) {
    function handleRemove(id) {
        setSelected((selected) =>
            selected.filter((user) => user.id !== id)
        );
    }
    return (
        <div className="choosen-list-container">
        <h2 className="choosen-list-header">Team members:</h2>
        <div className="choosen-list-items">
            {selected?.map((user, index) => (
            <div
                key={user.id}
                className="choosen-list-item">
                <span>{index + 1}.</span>
                <img
                className="choosen-list-avatar"
                src={avatar}
                alt={`${user.login} image`}
                />
                <span>{user.login}</span>
                <span className="choosen-list-remove">
                <GiCrossedBones onClick={() => handleRemove(user.id)}/>
                </span>
            </div>
            ))}
        </div>
        </div>
    );
}

export default ChoosenList;