import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { withStyles } from '@material-ui/styles';
import Style from './style';

const NewRoom = ({classes, onChangeShow}) => {

    const formRef = useRef();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData(formRef.current)
        const params = new URLSearchParams();
        for (const [key, value] of formdata.entries()) {
            params.append(key, value);
        }
        try {
            const response = await axios.post(
                `${process.env.API_BASE_URL}/rooms`, 
                params,
                {
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            const room = response.data;
            router.push(`/room/${room._id}`);
        } catch (e) {
            alert('Something is going wrong, try again !');
        }
    }

    return (
        <div className={classes.paper}>
            <h6 className={classes.title}>New room</h6>
            <form ref={formRef} onSubmit={handleSubmit} className={classes.form}>
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