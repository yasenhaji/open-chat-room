import React from 'react';
import { withStyles } from '@material-ui/styles';
import Messages from './Messages';
import ChatInput from './ChatInput';


const style = {
    chatbox: {
        height: "100%",
        flex: "1",
        position: "relative",
        display: "flex",
        flexDirection: "column"
    },
}

const ChatBox = ({classes, messages, subject, onAddMessage}) => {
    return (
        <div className={classes.chatbox}>
            <Messages messages={messages} />
            <ChatInput subject={subject} onAddMessage={onAddMessage} />
        </div>
    );
}

export default withStyles(style)(ChatBox);