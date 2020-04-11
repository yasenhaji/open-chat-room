import {withStyles} from '@material-ui/styles';
import { useCallback, useState } from 'react';
import axios from 'axios';
import SideBar from '../components/SideBar';
import ChatBox from '../components/ChatBox';
import { patchesGeneratingOpenChatReducer } from '../reducers';
import useSocket from '../hooks/useSocket'; 
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

const style = {
    root: {
        height: "100vh",
        fontFamily: "Roboto, arial, sans-serif",
        display: "flex",
        position: "relative"
    },
    linkToShare: {
        display: "flex",
        alignItems: "center",
        height: "30px",
        padding: "5px 10px",
        borderRadius: "5px",
        position: "absolute",
        top: "-40px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#F3E5F5",
        color: "#4527A0",
        zIndex: 10,
        transition: "top .3s linear",
        "&.show": {
            top: "10px",
        },
        "& button": {
            background: "transparent",
            border: 0,
            padding: 0,
            margin: 0,
            cursor: "pointer",
            outline: "none"
        },
        "& .icon": {
            fontSize: "16px",
            marginLeft: "20px",
            cursor: "pointer",
            color: "#4527A0",
        },
        "& .icon-close": {
            marginLeft: "10px" 
        }
    }
};

const initialState = {
    messages: [],
    connectedUsers: {}
}

const Room = ({room, name, port, wssPort, wssHost, classes}) => {

    const [state, setState] = useState(initialState);
    const [showLink, setShowLink] = useState(false);
    const {messages, connectedUsers} = state;

    const dispatch = useCallback(action => {
            setState(currentState => {
                const [nextState, patches] = patchesGeneratingOpenChatReducer(currentState, action);
                if (action.type !== 'APPLY_PATCHES') {
                    send(patches);
                }
                return nextState;
            })
        }, []
    );

    const send = useSocket(`wss://${wssHost}:${wssPort}/${room._id}`, (message) => {
        switch(message.type) {
            case "PATCHE":
                dispatch({
                    type: "APPLY_PATCHES",
                    patches: message.value
                });
                break;
            case "OPEN":
                dispatch({
                    type: 'ADD_USER',
                    id: message.value,
                    name
                });
                break;
            case "CLOSE":
                dispatch({
                    type: 'REMOVE_USER',
                    id: message.value
                });
                break;
        }
    });

    const handleAddMessage = useCallback((messageText) => {
        const message = {
            sender: name,
            datetime: new Date(),
            message: messageText
        }

        dispatch({
            type: 'ADD_MESSAGE',
            message
        });
    });

    return (
        <div className={classes.root}>
            <div className={`${classes.linkToShare} ${showLink ? 'show': ''}`}>
                {`https://${wssHost}/room/${room._id}`}
                <button onClick={() => {
                    setShowLink(false)
                }}>
                    <CancelRoundedIcon className="icon icon-close"/>
                </button>
            </div>
            <SideBar subject={room.subject} connectedUsers={connectedUsers} onShowShareLink={() => setShowLink(true)} />
            <ChatBox messages={messages} subject={room.subject} onAddMessage={handleAddMessage} />
        </div>
    )
}

Room.getInitialProps = async ({query}) => {

    const { roomId, name, port, wssPort, wssHost } = query;

    const response = await axios.get(`https://${wssHost}/api/rooms/${roomId}`)
    
    return { room: response.data, name, port, wssPort, wssHost };
}

export default withStyles(style)(Room);