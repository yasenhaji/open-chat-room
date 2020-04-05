import React, { memo } from 'react';
import { withStyles } from '@material-ui/styles';
import moment from 'moment';

const style = {
    message: {
        padding: "10px 20px",
        "& h6": {
            margin: 0,
            textTransform: "uppercase",
            fontWeight: "900",
            fontSize: "1rem",
            marginBottom: "8px",
            "& span":{
                textTransform: "lowercase",
                marginLeft: "10px",
                fontWeight: "500",
                fontSize: ".8rem",
                color: "#9E9E9E"
            }
        },
        "& p": {
            margin: 0
        }
    },
}

const Message = ({classes, message}) => {
    return (
        <div className={classes.message}>
            <h6>{message.sender}<span>{moment(message.datetime).format('H:mm')}</span></h6>
            <p>
                {message.message}
            </p>
        </div>
    );
}

export default withStyles(style)(memo(Message));
