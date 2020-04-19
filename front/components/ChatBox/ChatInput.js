import React, { useState } from 'react';
import { withStyles } from '@material-ui/styles';
import SendRoundedIcon from '@material-ui/icons/SendRounded';

const style = {
    chatInput: {
        margin: "20px",
        width: "calc(100% - 40px)",
        height: "60px",
        border: "1.5px solid #512DA8",
        borderRadius: "10px",
        padding: "20px 40px 20px 20px",
        boxSizing: "border-box",
        outline: "none",
        fontSize: "1rem",
        "&::placeholder": {
            color: "#BDBDBD",
            fontWeight: "300"
        }
    },
    sendBtn: {
        backgroundColor: "transparent",
        border: "0",
        position: "absolute",
        right: "20px",
        bottom: "36px",
        color: "#512DA8",
        cursor: "pointer",
        "&.disabled": {
            color: "#B39DDB"
        }
    }
}

const ChatInput = ({classes, subject, onAddMessage}) => {

    const [state, setState] = useState({messageText: ""});

    const { messageText } = state;

    return (
        <form onSubmit={(e) => {e.preventDefault(); messageText && onAddMessage(messageText); setState({messageText: ""})}}>
            <input
                className={classes.chatInput}
                value={messageText}
                onChange={(e) => setState({messageText: e.target.value})}
                placeholder={`Send message to ${subject}...`}  />
            <button type="submit" className={`${classes.sendBtn} ${!messageText ? "disabled" : "" }`}>
                <SendRoundedIcon />
            </button>
        </form>
    );
}

export default withStyles(style)(ChatInput);