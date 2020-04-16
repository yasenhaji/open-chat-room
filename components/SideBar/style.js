export default {
    sidebar: {
        width: "200px",
        minWidth: "200px",
        height: "100%",
        backgroundColor: "#7B1FA2",
    },
    subject: {
        margin: "0 0 20px",
        padding: "15px",
        color: "#FFF",
        textTransform: "capitalize",
        display: "flex",
        "& svg": {
            marginRight: "7px"
        }
    },
    onlineList: {
        margin: 0,
        padding: 0
    },
    onlineTitle: {
        margin: "0 0 15px",
        padding: "15px",
        fontSize: "1rem",
        color: "#EEEEEE",
        display: "flex",
        "& svg": {
            marginRight: "5px",
            fontSize: "14px"
        },
        "& .share-icon": {
            fontSize: "20px",
            marginLeft: "20px",
            cursor: "pointer"
        }
    },
    onlineItem: {
        padding: "5px 10px",
        display: "flex",
        alignItems: "center",
        listStyle: "none",
        textTransform: "uppercase",
        color: "#E0E0E0",
        "& svg": {
            fontSize: "16px",
            marginRight: "5px",
            color: "#4DB6AC"
        },
    },
}