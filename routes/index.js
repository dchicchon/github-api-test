const router = require("express").Router();
const axios = require("axios");
const moment = require("moment");
const path = require("path");


router.get("/user/:userName", function (req, res) {

    axios.get(`https://github-contributions-api.now.sh/v1/${req.params.userName}`)
        .then(user => {
            // console.log(user.data)
            // Now we want to split the data from weekly, monthly, and yearly

            // Here we have the current date
            let currentDate = moment().format('YYYY-MM-DD');
            let todayContributions = [];
            let weeklyContributions = [];
            let monthlyContributions = [];
            let yearlyContributions = [];


            // Today's data

            // Get the data for this week

            // Get the data for this month
            let thisMonth = currentDate.slice(0, 7)
            for (let i = 0; i < user.data.contributions.length; i++) {
                let monthDate = user.data.contributions[i].date.slice(0, 7)
                let todayDate = user.data.contributions[i].date

                if (monthDate == thisMonth) {
                    let thisDate = {
                        date: parseInt(moment(user.data.contributions[i].date).date()),
                        count: parseInt(user.data.contributions[i].count)
                    }
                    console.log(thisDate)
                    monthlyContributions.push(thisDate)
                }
                if (todayDate === currentDate) {
                    console.log(user.data.contributions[i])
                    let today = {
                        date: moment(user.data.contributions[i].date),
                        count: parseInt(user.data.contributions[i].count)
                    }
                    todayContributions.push(today)
                }
            }


            let userData = {
                today: todayContributions,
                weekly: '',
                monthly: monthlyContributions,
                yearly: ''
            }
            console.log(userData)


            res.json(userData)
        })
})

router.use(function (req, res) {
    res.sendFile(path.join(__dirname, "../client/public/index.html"))
})

module.exports = router;