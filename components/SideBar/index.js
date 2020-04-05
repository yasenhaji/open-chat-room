import React from 'react';
import { withStyles } from '@material-ui/styles';
import Style from './style';
import MeetingRoomRoundedIcon from '@material-ui/icons/MeetingRoomRounded';
import CommentRoundedIcon from '@material-ui/icons/CommentRounded';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import ScreenShareRoundedIcon from '@material-ui/icons/ScreenShareRounded';

const SideBar = ({connectedUsers, subject, onShowShareLink, classes}) => {
    return (
        <div className={classes.sidebar}>
            <h3 className={classes.subject}><MeetingRoomRoundedIcon />OpenChat</h3>
            <div>
                <h6 className={classes.onlineTitle}><CommentRoundedIcon />
                    {subject} 
                    <ScreenShareRoundedIcon title="Share room" className="share-icon" onClick={onShowShareLink} />
                </h6>
                <ul className={classes.onlineList}>
                    {
                        Object.values(connectedUsers).slice().sort((a,b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0).map((user, index) => {
                            return (
                                <li className={classes.onlineItem} key={index}>
                                    <FiberManualRecordRoundedIcon />{user.name}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    );
}

export default withStyles(Style)(SideBar);