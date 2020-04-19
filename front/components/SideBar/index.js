import React, { useState, useEffect } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { withStyles } from '@material-ui/styles';
import Style from './style';
import MeetingRoomRoundedIcon from '@material-ui/icons/MeetingRoomRounded';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';


const SideBar = ({connectedUsers, classes, currentUser, onSetName, name}) => {

    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState(name);

    useEffect(() => {
        setTimeout(() => {
            setUsername(name);
        }, 500);
    }, [name]);

    const handleSubmitEditing = (e) => {
        e.preventDefault();
        onSetName(username);
        setEditing(false);
    }

    if ((!editing && !username) || connectedUsers.length === 0) {
        return (
            <div className={classes.sidebar}>
                <h3 className={classes.subject}><MeetingRoomRoundedIcon />OpenChat</h3>
                <div>
                    <ul className={classes.onlineList}>
                        <li className={classes.onlineItem}><Skeleton animation="wave" className="skeleton-status" variant="circle" height={10} width={10} /><Skeleton animation="wave" variant="text" width={100} duration={2} /></li>
                        <li className={classes.onlineItem}><Skeleton animation="wave" className="skeleton-status" variant="circle" height={10} width={10} /><Skeleton animation="wave" variant="text" width={100} duration={2} /></li>
                        <li className={classes.onlineItem}><Skeleton animation="wave" className="skeleton-status" variant="circle" height={10} width={10} /><Skeleton animation="wave" variant="text" width={100} duration={2} /></li>
                        <li className={classes.onlineItem}><Skeleton animation="wave" className="skeleton-status" variant="circle" height={10} width={10} /><Skeleton animation="wave" variant="text" width={100} duration={2} /></li>
                        <li className={classes.onlineItem}><Skeleton animation="wave" className="skeleton-status" variant="circle" height={10} width={10} /><Skeleton animation="wave" variant="text" width={100} duration={2} /></li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className={classes.sidebar}>
            <h3 className={classes.subject}><MeetingRoomRoundedIcon />OpenChat</h3>
            <div>
                <ul className={classes.onlineList}>
                    <li className={classes.onlineItem}>
                        <FiberManualRecordRoundedIcon />
                        <form onSubmit={handleSubmitEditing}>
                            {
                                editing ?
                                <input value={username} onChange={(e) => setUsername(e.target.value)} />:
                                username
                            }
                            {
                                !editing ?
                                <button key="edit" aria-label="edit username" type="button" onClick={() => setEditing(current => !current)} >
                                    <EditIcon aria-hidden="true" className="edit-icon" />
                                </button>:
                                <button aria-label="submit edit username" type="submit" >
                                    <DoneIcon aria-hidden="true" />
                                </button>
                            }
                        </form>
                    </li>
                    {
                        Object.values(connectedUsers).slice()
                        .sort((a,b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
                        .filter(user => user.id !== currentUser)
                        .map((user, index) => {
                            return (
                                <li className={classes.onlineItem} key={index}>
                                    <FiberManualRecordRoundedIcon />
                                    {user.name}
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        </div>
    );
}

export default withStyles(Style)(SideBar);