import React from 'react';
import { withStyles } from '@material-ui/styles';
import Style from './style';

const NewRoom = ({classes, onChangeShow}) => {
    return (
        <div className={classes.paper}>
            <h6 className={classes.title}>New room</h6>
            <form action='/api/rooms' method='post' className={classes.form}>
                <div className={classes.formGroup}>
                    <label className={'label-input'}>Subject</label>
                    <input name='subject' className={classes.formInput} placeholder="Subject"/>
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.inputLabel}>Name</label>
                    <input name='name' className={classes.formInput} placeholder="Name"/>
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.inputLabel}>Email</label>
                    <input name='email' className={classes.formInput} placeholder="Email"/>
                </div>
                <div className={classes.formOptions}>
                    <a className={classes.formLink} href="#" onClick={(e) => {e.preventDefault(); onChangeShow("JOIN")}}>Join room</a>
                    <button type="submit" className={classes.formButton}>
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
}

export default withStyles(Style)(NewRoom);