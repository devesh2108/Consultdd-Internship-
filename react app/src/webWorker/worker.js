export default () => {
    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        if (!e) return;
        let users = e.data;
        console.log(users)
        postMessage(users);
    })
}
