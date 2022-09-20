

type T_NotificationAction = {
    token
}

type T_Notification = {
    createdOn: T_Timestamp,
    indId: T_IndId,
    message: T_HTML,
    viewedOn: T_Timestamp,
    token: T_Token,
    tokenConsumed: T_Timestamp,
    form: {
        issueDescription: T_HTML,
        buttons: E_Button[],
        action: E_Button,
    }
}


