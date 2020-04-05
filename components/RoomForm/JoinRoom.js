import React, { useState } from 'react';
import Router from 'next/router';
import { withStyles } from '@material-ui/styles';
import Style from './style';

const JoinRoom = ({classes, onChangeShow, roomId: roomIdFromProps}) => {

    const [roomId, setRoomId] = useState(roomIdFromProps || "");
    const [name, setName] = useState("");

    const handleSubmitForm = (e) => {
        e.preventDefault();
        const url = `/room/${roomId}/${name}`;
        Router.push(url);
    };

    return (
        <div className={classes.paper}>
            <h6 className={classes.title}>Join room</h6>
            <form className={classes.form} onSubmit={handleSubmitForm} >
                <div className={classes.formGroup}>
                    <label className={'label-input'}>Room ID</label>
                    <input name='roomId' value={roomId} onChange={(e) => setRoomId(e.target.value)} className={classes.formInput} placeholder="Room ID"/>
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.inputLabel}>Name</label>
                    <input name='name' value={name} onChange={(e) => setName(e.target.value)} className={classes.formInput} placeholder="Name"/>
                </div>
                <div className={classes.formOptions}>
                    <a className={classes.formLink} href="#" onClick={(e) => {e.preventDefault(); onChangeShow("OPEN")}}>Open new room</a>
                    <button type="submit" className={classes.formButton}>
                        Join
                    </button>
                </div>
            </form>
        </div>
    );
}

export default withStyles(Style)(JoinRoom);