import React, { Component } from 'react';

// Victory
// import * as V from 'victory';
import { VictoryChart, VictoryLine, VictoryContainer, VictoryVoronoiContainer, VictoryAxis, VictoryLabel, VictoryLegend } from 'victory';

// import moment, { duration } from 'moment';
import API from './Utils/API';
import NewInput from './Components/NewInput';

class App extends Component {
  state = {
    // users: [],
    numUsers: ['user'],
    // user: '',
    // userData: [],
    userData2: [],
    userLabels: [],
    dataFormat: 'monthly',
    avgCommits: '',

    userLegend: []

  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  // handleSubmit = event => {
  //   event.preventDefault();
  //   console.log(this.state.user)
  //   API.getInfo(this.state.user)
  //     .then(res => {

  //       // We want to set the max y value by getting the greatest value of y in our array of objects
  //       var sortedCount = res.data.monthly.sort((a, b) => (a.count > b.count) ? 1 : -1);
  //       var xMax = sortedCount[sortedCount.length - 1].count

  //       // We want to set the max x value by getting the greatest value of y in our array of objects
  //       var sortedDate = res.data.monthly.sort((a, b) => (a.date > b.date) ? 1 : -1);
  //       var yMax = sortedDate[sortedDate.length - 1].date

  //       // We want to get the Average commits for this month to date
  //       console.log(moment().date())
  //       var sum = 0;
  //       for (let i = 0; i < res.data.monthly.length; i++) {
  //         sum += res.data.monthly[i].count
  //       }
  //       console.log(sum)
  //       var avgCommits = sum / moment().date()
  //       console.log(`You made ${avgCommits} commits a day on average`)

  //       let labelArr = res.data.monthly.map(x => `Sept.${x.date}, ${x.count} commits`)
  //       console.log(labelArr)
  //       this.setState({
  //         userLabels: labelArr,
  //         userData: res.data.monthly,
  //         xMax: xMax,
  //         yMax: yMax,
  //         avgCommits: avgCommits
  //         // avgCommits: avgCommits
  //       })

  //       console.log(this.state.userData)

  //     })
  // }

  multSubmit = event => {

    event.preventDefault();
    let userArr = document.getElementsByClassName("user")
    let names = [];
    for (let i = 0; i < userArr.length; i++) {
      console.log(userArr[i])
      if (userArr[i] !== '') {
        console.log("made it")
        names.push(userArr[i].value)
      }
    }

    let data = {
      users: names
    }

    console.log(data)
    API.getUsers(data)
      .then(res => {
        console.log(res.data.users)
        let legend = [];
        for (let i = 0; i < res.data.users.length; i++) {
          console.log(res.data.users[i].color)
          console.log(res.data.users[i].author)
          let entry = {
            name: res.data.users[i].author,
            symbol: { fill: res.data.users[i].color }
          }
          legend.push(entry)
        }
        this.setState({
          userData2: res.data.users,
          userLegend: legend
        })
      })

  }

  addUser = () => {
    let newArr = this.state.numUsers
    newArr.push('user')
    this.setState({
      numUsers: newArr
    })
  }

  changeFormat = event => {
    event.preventDefault();
    const { id } = event.target
    this.setState({
      dataFormat: id
    })
  }

  renderSwitch(param) {
    switch (param) {
      case 'weekly':
        return this.state.userData2
      case 'montly':
        return this.state.userData2
      case 'yearly':
        return this.state.userData2
    }
  }

  render() {

    return (
      <div>

        <div className='container'>
          <h4>Contribution Line Graph</h4>

          {/* I want to have a plus button below this input to add additional users */}
          <div className='input-section'>
            {/* <div className='input-field col s6'>
            <input id='user' name='user' value={this.state.user} onChange={this.handleInputChange} type='text' className='validate'></input>
            <label htmlFor='user'>User</label>
          </div> */}

            {this.state.numUsers.length ?

              this.state.numUsers.map((elm, i) => (
                <NewInput
                  key={i}
                />
              ))
              : ''}


            {/* Here we want to add more inputs based on the numUsers state */}

          </div>
          <button className='btn' onClick={this.multSubmit}>Submit</button><button className='btn' onClick={this.addUser}>Add User</button>
        </div>

        {this.state.userData2.length ?
          <div>
            <VictoryChart
              // height={650}
              // width={1300}
              domainPadding={{ y: 20 }}
              padding={50}
            >
              <VictoryAxis
                axisLabelComponent={<VictoryLabel />}
                label={'Days this month'}
                style={{
                  axisLabel: { fontSize: 7 },
                  grid: { stroke: 'lightgrey' },
                  tickLabels: { fontSize: 5 }
                }}
              />
              <VictoryAxis
                dependentAxis={true}
                axisLabelComponent={<VictoryLabel />}
                label={'Number of Commits'}
                style={{
                  axisLabel: { fontSize: 7 },
                  grid: { stroke: 'lightgrey' },
                  tickLabels: { fontSize: 5 }

                }}

              />
              <VictoryLegend
                x={150}
                y={50}
                title='Legend'
                centerTitle
                orientation='vertical'
                gutter={20}
                itemsPerRow={4}
                // borderPadding={0}
                style={{ border: { stroke: 'black' }, title: { fontSize: 7 }, labels: { fontSize: 5 }, names: { fontSize: 5 } }}
                data={this.state.userLegend}
                height={10}
              />

              {this.state.userData2.map(
                (user, i) => (
                  <VictoryLine
                    interpolation='natural'
                    name={user.author}
                    key={i}
                    // data={user.monthly}
                    data={user[`${this.state.dataFormat}`]}
                    // data={this.state.dataFormat === 'monthly' ? user.monthly : '' || this.state.dataFormat === 'weekly' ? user.weekly : '' || this.state.dataFormat === 'yearly' ? user.yearly : ''}
                    style={{
                      data: { stroke: user.color, strokeWidth: 0.8 }
                    }}
                    x='date'
                    y='count'
                  // data={user}
                  />
                )
              )}
            </VictoryChart>
            <button type='button' id='weekly' className='btn' onClick={this.changeFormat}>Weekly</button><button type='button' id='monthly' className='btn' onClick={this.changeFormat}>Monthly</button><button type='button' id='yearly' className='btn' onClick={this.changeFormat}>Yearly</button>
          </div>
          : ''}


      </div >
    );
  }

}
export default App;
