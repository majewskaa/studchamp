import { FiChevronDown } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import avatar from '../../resources/avatar.png';
import Button from '@material-ui/core/Button';

import './Dropdown.css';

const Dropdown = ({ choice, setIsDropdownOpen, isDropdownOpen, selected, setSelected }) => {
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const nothing = (e) => {
        e.stopPropagation();
    };

    function handleAssign(user) {
        setSelected((prevList) => {
          if (prevList.includes(user)) {
            const updatedList = prevList.filter((item) => item !== user);
            return updatedList;
          } else {
            return [...prevList, user];
          }
        });
    }

    return (
        <div>

        <Button variant="contained" className="dropdown-button" onClick={toggleDropdown}>
            <span className="dropdown-block">
            <FiChevronDown color="#1A2044" size={24} />
            </span>
            { isDropdownOpen && (
            <div className="dropdown-selectable" onClick={nothing}>
                <ul className="dropdown-container">
                {choice.map((option) => (
                    <li
                    key={option.id}
                    className="dropdown-item"
                    onClick={() => handleAssign(option)}>
                        {selected.includes(option) && <GiCheckMark />}
                    <img
                        className="user-avatar"
                        src={avatar}
                        alt={`${option.login} image`}
                    />
                    <span>{option.login}</span>
                    </li>
                ))}
                </ul>
            </div>
            )}
        </Button>
        </div>
    );
};
export default Dropdown;