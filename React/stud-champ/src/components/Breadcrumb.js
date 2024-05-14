import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ subject = {}, project = {}, task = {} }) => (
    <div className='breadcrumb'>
        {subject.id && <><Link to={`/subjects/${subject.id}`}>{subject.name}</Link> {'>'} </>}
        {project.id && <><Link to={`/projects/${project.id}`}>{project.name}</Link> {'>'} </>}
        {task.id && <Link to={`/tasks/${task.id}`}>{task.name}</Link>}
    </div>
);

export default Breadcrumb;