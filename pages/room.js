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
        position: "relative",
        ['@media (max-width:780px)']: {
            width: "calc(100% + 200px)",
            transform: "translateX(-200px)",
            transition: "transform 0.2s linear",
            overflow: "hidden",
            "&.show": {
                transform: "translateX(0)",
                width: "100%",
            }
        }
    },
    linkToShare: {
        display: "flex",
        alignItems: "center",
        height: "30px",
        padding: "5px 10px",
        borderRadius: "5px",
        position: "absolute",
        top: "-40px",
        right: "10px",
        maxWidth: "100vh",
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
        },
        ['@media (max-width:780px)']: {
            maxWidth: "calc(100% - 240px)"
        }
    },
};

const initialState = {
    messages: [],
    connectedUsers: {}
}

const Room = ({room, name, socketBaseUrl, classes}) => {

    const [state, setState] = useState(initialState);
    const [showLink, setShowLink] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const {messages, connectedUsers} = state;

    const dispatch = useCallback(action => {
            setState(currentState => {
                const [nextState, patches] = patchesGeneratingOpenChatReducer(currentState, action);
                if (action.type === 'ADD_MESSAGE') {
                    send(patches);
                }
                return nextState;
            })
        }, []
    );

    const send = useSocket(`${socketBaseUrl}?roomId=${room._id}&name=${name}`, (message) => {
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
                    id: message.id,
                    name: message.name
                });
                break;
            case "CONNECTED_USERS":
                dispatch({
                    type: "CONNECTED_USERS",
                    users: message.users
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
        <div className={`${classes.root} ${showMenu? 'show':''}`}>
            <div className={`${classes.linkToShare} ${showLink ? 'show': ''}`}>
                {room._id}
                <button onClick={() => {
                    setShowLink(false)
                }}>
                    <CancelRoundedIcon className="icon icon-close"/>
                </button>
            </div>
            <SideBar showMenu={showMenu} subject={room.subject} connectedUsers={connectedUsers} />
            <ChatBox messages={messages} subject={room.subject} onShowMenu={() => setShowMenu(!showMenu)} onAddMessage={handleAddMessage} onShowShareLink={() => {if (showMenu) {setShowMenu(false);} setShowLink(true)} } />
        </div>
    )
}

Room.getInitialProps = async ({query}) => {

    const { roomId, name, webBaseUrl, socketBaseUrl } = query;

    const response = await axios.get(`${webBaseUrl}/api/rooms/${roomId}`);
    
    return { room: response.data, name, socketBaseUrl };
}

export default withStyles(style)(Room);