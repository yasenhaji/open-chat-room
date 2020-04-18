import {withStyles} from '@material-ui/styles';
import { useCallback, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import axios from 'axios';
import {Howl} from 'howler';
import SideBar from '../components/SideBar';
import ChatBox from '../components/ChatBox';
import { patchesGeneratingOpenChatReducer } from '../reducers';
import useSocket from '../hooks/useSocket';
import useLocalStorage from '../hooks/useLocalStorage';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import useInterval from '../hooks/useInterval';

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
    connectedUsers: {}
}

const Room = ({room, name, socketBaseUrl, classes}) => {

    const [state, setState] = useState(initialState);
    const [showLink, setShowLink] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [thereIsNewMessages, setThereIsNewMessages] = useState(false);
    const [pageIsVisible, setPageIsVisible] = useState(true);
    const [toBeNotified, setToBeNotified] = useLocalStorage(`openchat_toBeNotified_${room._id}`, false);
    const {messages, connectedUsers} = state;
    /** Updating page title when new messages */
    const [startSetInterval, stopSetInterval] = useInterval(() => {
        setThereIsNewMessages(!thereIsNewMessages)
    }, 1000);

    /** notification sound */
    let sound = useRef();

    /** componentDidMount register page visiblity listeners */
    useEffect(() => {
        if (window !== undefined) {
            window.addEventListener('focus', setPageVisibility, false);
            window.addEventListener('blur', setPageVisibility, false);
            return () => {
                window.removeEventListener('focus', setPageVisibility);
                window.removeEventListener('blur', setPageVisibility);
            }
        }
    }, []);

    /** Stop changing page title when page is visible */
    useEffect(() => {
        if (pageIsVisible) {
            stopSetInterval();
            setThereIsNewMessages(() => false);
        }
    }, [pageIsVisible]);

    const dispatch = useCallback(action => {
        setState(currentState => {
            const [nextState, patches] = patchesGeneratingOpenChatReducer(currentState, action);
            if (action.type === 'ADD_MESSAGE') {
                send(patches);
            }
            return nextState;
        })
    }, []);

    const send = useSocket(`${socketBaseUrl}?roomId=${room._id}&name=${name}`, (message) => {
        switch(message.type) {
            case "PATCHE":
                dispatch({
                    type: "APPLY_PATCHES",
                    patches: message.value
                });
                handleNotify();
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

    const handleNotify = () => {
        if (!pageIsVisible) {
            toBeNotified && sound.current && sound.current.play();
            startSetInterval();
        } else {
            stopSetInterval();
            setThereIsNewMessages(() => false);
        }
    };

    const setPageVisibility = useCallback(() => {
        if (document.hasFocus()) {
            setPageIsVisible(true);
        } else {
            setPageIsVisible(false);
            if (!sound.current) {
                sound.current = new Howl({
                    src: ['/audio/open-chat-notif.mp3']
                });
            }
        }
    }, []);

    

    return (
        <div className={`${classes.root} ${showMenu? 'show':''}`} >
            <Head>
                <title>
                    {
                        thereIsNewMessages ?
                        'New messages':
                        'Open Chat Room'
                    }
                </title>
            </Head>
            <div className={`${classes.linkToShare} ${showLink ? 'show': ''}`}>
                {room._id}
                <button onClick={() => {
                    setShowLink(false)
                }}>
                    <CancelRoundedIcon className="icon icon-close"/>
                </button>
            </div>
            <SideBar showMenu={showMenu} subject={room.subject} connectedUsers={connectedUsers} />
            <ChatBox toBeNotified={toBeNotified} onSetToBeNotified={setToBeNotified} messages={messages} subject={room.subject} onShowMenu={() => setShowMenu(!showMenu)} onAddMessage={handleAddMessage} onShowShareLink={() => {if (showMenu) {setShowMenu(false);} setShowLink(true)} } />
        </div>
    )
}

Room.getInitialProps = async ({query}) => {

    const { roomId, name, webBaseUrl, socketBaseUrl } = query;

    const response = await axios.get(`${webBaseUrl}/api/rooms/${roomId}`);
    
    return { room: response.data, name, socketBaseUrl };
}

export default withStyles(style)(Room);