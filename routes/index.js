const router = require("express").Router();
const axios = require("axios");
const moment = require("moment");
const path = require("path");

// Using moment we get our values for the current date
let currentDate = moment().format('YYYY-MM-DD');
// let currentYear = parseInt(currentDate.slice(0, 4));
let currentYear = moment(currentDate).year();
let currentMonth = moment(currentDate).month();
let currentWeek = moment(currentDate).week();
let currentDay = moment(currentDate).date();




let colors = ['darkblue', 'darkred', 'darkgreen', 'cyan', 'purple', 'teal', 'lightblue', 'grey'];

// router.get("/user/:userName", function (req, res) {


//     axios.get(`https://github-contributions-api.now.sh/v1/${req.params.userName}`)
//         .then(user => {
//             // console.log(user.data)
//             // Now we want to split the data from weekly, monthly, and yearly

//             // Here we have the current date
//             let todayContributions = [];
//             let weeklyContributions = [];
//             let monthlyContributions = [];
//             let yearlyContributions = [];


//             // Today's data

//             // Get the data for this week

//             // Get the data for this month
//             let thisMonth = currentDate.slice(0, 7)
//             for (let i = 0; i < user.data.contributions.length; i++) {
//                 let monthDate = user.data.contributions[i].date.slice(0, 7)
//                 let todayDate = user.data.contributions[i].date

//                 if (monthDate == thisMonth) {
//                     let thisDate = {
//                         date: parseInt(moment(user.data.contributions[i].date).date()),
//                         count: parseInt(user.data.contributions[i].count)
//                     }
//                     console.log(thisDate)
//                     monthlyContributions.push(thisDate)
//                 }
//                 if (todayDate === currentDate) {
//                     console.log(user.data.contributions[i])
//                     let today = {
//                         date: moment(user.data.contributions[i].date),
//                         count: parseInt(user.data.contributions[i].count)
//                     }
//                     todayContributions.push(today)
//                 }
//             }


//             let userData = {
//                 today: todayContributions,
//                 weekly: '',
//                 monthly: monthlyContributions,
//                 yearly: ''
//             }
//             console.log(userData)
//             res.json(userData)
//         })
// })

router.post("/user", function (req, res) {
    let users = req.body.users
    let userData = []
    console.log('Current Date', currentDate)
    console.log('Current Day', currentDay)
    console.log("Current Week", currentWeek)
    console.log('Current Month', currentMonth)
    console.log('Current Year', currentYear)
    for (let i = 0; i < users.length; i++) {
        axios.get(`https://github-contributions-api.now.sh/v1/${users[i]}`)
            .then(user => {

                // Format Data to day count
                let weeklyContributions = [];
                let monthlyContributions = [];
                let yearlyContributions = [];
                let thisMonth = currentDate.slice(0, 7);

                // Iterate through list of contributions
                for (let i = 0; i < user.data.contributions.length; i++) {
                    let userDate = user.data.contributions[i].date
                    let monthDate = userDate.slice(0, 7);

                    // WEEKLY FILTER
                    // This will get all the days from this week
                    if (moment(userDate).week() === currentWeek && moment(userDate).weekYear() === currentYear && moment(userDate).month() === currentMonth) {
                        let thisDate = {
                            date: parseInt(moment(user.data.contributions[i].date).date()),
                            count: parseInt(user.data.contributions[i].count)
                        }
                        weeklyContributions.push(thisDate)
                    }

                    // MONTHLY FILTER
                    // If the month is equal to this month of this year
                    if (monthDate == thisMonth) {
                        let thisDate = {
                            date: parseInt(moment(user.data.contributions[i].date).date()),
                            count: parseInt(user.data.contributions[i].count)
                        }
                        // console.log(thisDate)
                        monthlyContributions.push(thisDate)
                    }

                    // YEARLY FILTER
                    if (moment(userDate).weekYear() === currentYear) {
                        let thisDate = {
                            date: parseInt(moment(user.data.contributions[i].date).dayOfYear()),
                            count: parseInt(user.data.contributions[i].count)
                        }
                        yearlyContributions.push(thisDate)
                    }
                }

                // This is our user, we want to push this formatted version of the data recieved to our userData array
                let newUser = {
                    author: users[i],
                    color: colors[i],
                    weekly: weeklyContributions,
                    monthly: monthlyContributions,
                    yearly: yearlyContributions
                }

                // console.log("\n", newUser)

                userData.push(newUser)

                // At the end of the loop. Scaled to include more users
                if (userData.length === users.length) {
                    let returnData = {
                        users: userData
                    }

                    console.log("\nReturn Data")
                    console.log(returnData)
                    res.json(returnData)
                }
            })

    }


})

router.use(function (req, res) {
    res.sendFile(path.join(__dirname, "../client/public/index.html"))
})

module.exports = router;