import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ subject, project, task}) => (
    <div className='breadcrumb'>
        {subject && <><Link to={`/subjects/${subject}`} style={{ color: 'white', textDecoration: 'none' }}>{subject}</Link>  </>}
        {project && <>{'>'}<Link to={`/projects/${project.id}`}>{project.name}</Link> </>}
        {task && <> {'>'}<Link to={`/tasks/${task.id}`}>{task.name}</Link></>}
    </div>
);

export default Breadcrumb;