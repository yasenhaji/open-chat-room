import React from 'react';
import { withStyles } from '@material-ui/styles';
import Messages from './Messages';
import ChatInput from './ChatInput';
import ScreenShareRoundedIcon from '@material-ui/icons/ScreenShareRounded';
import MenuIcon from '@material-ui/icons/Menu';

const style = {
    chatbox: {
        height: "100%",
        width: "calc(100% - 200px)",
        overflowWrap: "break-word",
        flex: "1",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        ['@media (max-width:780px)']: {
            width: "100vw"
        }
    },
    header: {
        height: '60px',
        backgroundColor: '#FFF',
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "20px",
        color: "#4527A0",
        textTransform: "uppercase",
        fontWeight: "700",
        boxSizing: "border-box",
        boxShadow: "1px 2px 10px -3px rgba(0,0,0,0.21)",
        "& svg": {
            marginLeft: "20px",
            cursor: "pointer"
        }
    },
    menu: {
        fontSize: "40px",
        display: "none",
        "& svg": {
            marginLeft: 0,
            marginRight: "20px"
        },
        ['@media (max-width:780px)']: {
            display: "block"
        }
    }
}

const ChatBox = ({classes, messages, subject, onAddMessage, onShowShareLink, onShowMenu}) => {
    return (
        <div className={classes.chatbox}>
            <div className={classes.header}>
                <div className={classes.menu}>
                    <MenuIcon onClick={onShowMenu} />
                </div>
                # {subject}
                <ScreenShareRoundedIcon title="Share room" className="share-icon" onClick={onShowShareLink} />
            </div>
            <Messages messages={messages} />
            <ChatInput subject={subject} onAddMessage={onAddMessage} />
        </div>
    );
}

export default withStyles(style)(ChatBox);