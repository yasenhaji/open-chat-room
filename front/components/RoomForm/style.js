export default {
    paper: {
        padding: "20px 30px",
        backgroundColor: "#FFF",
        width: "90%",
        maxWidth: "275px",
        borderRadius: "6px",
        boxShadow: "0px 0px 4px 0px rgba(#311B92,0.75)",
    },

    title: {
        margin: 0,
        marginBottom: "20px",
        color: "#6A1B9A",
        fontSize: "1.5rem",
        fontWeight: "300"
    },
    form: {
        width: "100%",
        position: "relative"
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",

        "& label": {
            opacity: 0,
            transition: "opacity .3s linear"
        },
        "&.editing": {
            "label": {
                opacity: 1
            }
        }
    },
    
    formInput: {
        paddingBottom: "8px",
        paddingRight: "32px",
        border: "0",
        borderRadius: "0",
        borderBottom: "1px solid #9E9E9E",
        outline: "none",
        fontSize: "1rem",
        fontWeight: "300",
        "&:focus": {
            borderColor: "#4527A0"
        }
    },
    formOptions: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "48px"
    },
    formButton: {
        padding: "10px 20px",
        border: "none",
        cursor: "pointer",
        backgroundColor: "#4527A0",
        color: "#FFF",
        "&:hover": {
            backgroundColor: "#512DA8"
        }
    },
    formLink: {
        fontSize: "12px",
        lineHeight: "12px",
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline"
        }
    }
}