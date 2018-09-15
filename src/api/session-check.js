export default (session, res) => {
    console.log(session);

    if (session.authorized !== true) {
        res.sendStatus(401);
        return false;
    } else {
        return true;
    }
};