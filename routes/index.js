const router = require("express").Router();
const axios = require("axios");
const moment = require("moment");
const path = require("path");

let currentDate = moment().format('YYYY-MM-DD');
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
    console.log(users)
    let userData = []
    console.log(`\n`, users)
    for (let i = 0; i < users.length; i++) {
        axios.get(`https://github-contributions-api.now.sh/v1/${users[i]}`)
            .then(user => {

                // Format Data to day count
                let monthlyContributions = [];
                let thisMonth = currentDate.slice(0, 7);

                // Iterate through list of contributions
                for (let i = 0; i < user.data.contributions.length; i++) {
                    let monthDate = user.data.contributions[i].date.slice(0, 7)
                    // let todayDate = user.data.contributions[i].date

                    // If the month is equal to this month of this year
                    if (monthDate == thisMonth) {
                        let thisDate = {
                            date: parseInt(moment(user.data.contributions[i].date).date()),
                            count: parseInt(user.data.contributions[i].count)
                        }
                        console.log(thisDate)
                        monthlyContributions.push(thisDate)
                    }
                }

                // This is our user, we want to push this formatted version of the data recieved to our userData array
                let newUser = {
                    author: users[i],
                    color: colors[i],
                    monthly: monthlyContributions
                }

                console.log("\n", newUser)

                userData.push(newUser)

                // At the end of the loop. Scaled to include more users
                // Need an async/await function here!
                if (userData.length === users.length) {
                    console.log("\nEnd Loop")

                    let returnData = {
                        users: userData
                    }

                    console.log("Return Data\n")
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