export default (req, res) => {
    if (req.session.userIndex === undefined) {
        res.sendStatus(401);
        return false;
    } else {
        return true;
    }
};