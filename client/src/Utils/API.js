import axios from 'axios';

export default {
    getInfo: function (user) {
        return axios.get("/user/" + user)
    },
    getUsers: function (users) {
        return axios.post("/user", users)
    }
}