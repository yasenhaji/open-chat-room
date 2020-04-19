import {withStyles} from '@material-ui/styles';
import { useCallback, useState, useEffect, useRef } from 'react';
import Router from 'next/router';
import axios from 'axios';
import SideBar from '../components/SideBar';
import ChatBox from '../components/ChatBox';
import { patchesGeneratingOpenChatReducer, openChatReducer } from '../reducers';
import useSocket from '../hooks/useSocket';
import useLocalStorage from '../hooks/useLocalStorage';
import { USERNAME_KEY } from '../constants';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

const style = {
    root: {
        height: "100%",
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
    connectedUsers: {},
    currentUser: 'test'
}

const Room = ({room, socketBaseUrl, classes}) => {

    const [state, setState] = useState(initialState);
    const [mounted, setMounted] = useState(false);
    const [showLink, setShowLink] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [name, setName] = useLocalStorage(USERNAME_KEY, '');
    const {messages, connectedUsers, currentUser} = state;

    useEffect(() => {
        if (name === '' && mounted) {
            Router.push({
                pathname: '/',
                query: { roomId: room._id },
            })
        }
    }, [name, mounted]);

    useEffect(() => {
        setMounted(true);
    });

    const dispatch = useCallback(action => {
            setState(currentState => {
                return openChatReducer(currentState, action);
            })
        }, []
    );

    const send = useSocket(`${socketBaseUrl}?roomId=${room._id}`, (message) => {
        switch(message.type) {
            case "ADD_USER":
                const add_action = {
                    type: 'ADD_USER',
                    id: message.id,
                    name: message.name
                }
                dispatch(add_action);
                break;
            case "CONNECTED_USERS":
                dispatch({
                    type: "CONNECTED_USERS",
                    users: message.users
                });
                break;
            case "CLOSE":
                console.log("Closing !!!", message.value);
                dispatch({
                    type: 'REMOVE_USER',
                    id: message.value
                });
                break;
            case "CURRENT_USER":
                dispatch({
                    type: 'CURRENT_USER',
                    id: message.value
                });
                const open_action = {
                    type: 'ADD_USER',
                    id: message.value,
                    name
                }
                send(open_action);
                break;
            case "ADD_MESSAGE":
                dispatch({
                    type: 'ADD_MESSAGE',
                    message: message.value
                });
                break;
            case "SET_NAME":
                dispatch({
                    type: 'SET_NAME',
                    id: message.id,
                    name: message.name
                });
                break;
        }
    });

    const handleAddMessage = useCallback((messageText) => {
        const message = {
            sender: {
                id: currentUser,
                name
            },
            datetime: new Date(),
            message: messageText
        }

        send({
            type: 'ADD_MESSAGE',
            value: message
        })

        dispatch({
            type: 'ADD_MESSAGE',
            message
        });
    });

    const handleSetName = useCallback((value) => {
        setName(value);
        const action = {
            type: 'SET_NAME',
            id: currentUser,
            name: value
        };
        dispatch(action);
        send(action);
    });

    return (
        <div className={`${classes.root} ${showMenu? 'show':''}`} >
            <div className={`${classes.linkToShare} ${showLink ? 'show': ''}`}>
                {room._id}
                <button onClick={() => {
                    setShowLink(false)
                }}>
                    <CancelRoundedIcon className="icon icon-close"/>
                </button>
            </div>
            <SideBar name={name} onSetName={handleSetName} connectedUsers={connectedUsers} currentUser={currentUser} />
            <ChatBox messages={messages} subject={room.subject} onShowMenu={() => setShowMenu(!showMenu)} onAddMessage={handleAddMessage} onShowShareLink={() => {if (showMenu) {setShowMenu(false);} setShowLink(true)} } />
        </div>
    )
}

Room.getInitialProps = async ({query}) => {
    const { roomId, webBaseUrl, socketBaseUrl } = query;

    const response = await axios.get(`${webBaseUrl}/api/rooms/${roomId}`);
    
    return { room: response.data, socketBaseUrl };
}

export default withStyles(style)(Room);