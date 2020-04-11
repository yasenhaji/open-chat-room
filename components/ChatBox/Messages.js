import React, { useEffect, useRef } from 'react';
import { withStyles } from '@material-ui/styles';
import Message from './Message';

const style = {
    messages: {
        display: "flex",
        flexFlow: "column nowrap",
        overflowY: "auto",
        paddingTop: "60px",
        scrollbarColor: "#7B1FA2",
        "&::-webkit-scrollbar-track": {
            borderRadius: "8px",
            backgroundColor: "#F5F5F5"
        },
        "&::-webkit-scrollbar": {
            width: "8px",
            backgroundColor: "#F5F5F5"
        },
        "&::-webkit-scrollbar-thumb": {
            borderRadius: "4px",
            backgroundColor: "#7B1FA2"
        },
        flex: 1,
        "& > :first-child": {
            marginTop: 'auto'
        }
    },
    noMessageFound: {
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        "& p": {
            fontSize: "1.25rem",
            color: "#E0E0E0",
            textAlign: "center"
        }
    }
}

const Messages = ({classes, messages}) => {

    const messagesDiv = useRef(null);

    const updateScroll = () => {
        messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
    }

    useEffect(() => {
        updateScroll();
    }, [messages])

    return (
        <div className={classes.messages} ref={messagesDiv} >
            {
                messages.length ?
                messages.slice().sort((a,b) => a.datetime < b.datetime ? -1 : a.datetime > b.datetime ? 1 : 0).map((message, index) => {
                    return <Message key={index} message={message} />
                })
                :
                <div className={classes.noMessageFound}>
                    <p>
                        No Message Found !<br/>
                        Please start the conversation...
                    </p>
                </div>
            }
        </div>
    );
}

export default withStyles(style)(Messages);