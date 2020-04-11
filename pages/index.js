import NewRoom from '../components/RoomForm/NewRoom';
import {withStyles} from '@material-ui/styles';
import { useState } from 'react';
import JoinRoom from '../components/RoomForm/JoinRoom';

const style = {
    title: {
        padding: "10px 30px",
        margin: "0 auto 20px",
        fontSize: "2rem",
        color: "#FFF",
        textAlign: "center",
    },
    root: {
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#7B1FA2",
        margin: "0",
        fontFamily: "Roboto, arial, sans-serif",
    }
}

const Index = ({classes, roomId }) => {
    const [state, setState] = useState({
        view: "OPEN"
    });
    const { view } = state;

    const handleChangeView = (view) => {
        setState({ view });
    }

    return (
        <div className={classes.root}>
            <Head>
                <title>Open Chat Room</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <h3 className={classes.title}>
                OpenChat
            </h3>
            {
                view === "JOIN" || roomId ?
                <JoinRoom key="join" onChangeShow={handleChangeView} roomId={roomId}/>:
                <NewRoom key="open" onChangeShow={handleChangeView} />
            }
            
        </div>
    );
};

Index.getInitialProps = async ({query}) => {
    const {roomId} = query;

    return {roomId}
}

export default withStyles(style)(Index);