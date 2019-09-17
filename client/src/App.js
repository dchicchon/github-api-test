import React, { Component } from 'react';

import { VictoryLine, VictoryChart, VictoryTheme } from 'victory';
import XYFrame from "semiotic/lib/XYFrame";
import { scaleTime } from 'd3-scale';

import API from './Utils/API'


const theme = ["#ac58e5", "#E0488B", "#9fd0cb", "#e0d33a", "#7566ff", "#533f82", "#7a255d", "#365350", "#a19a11", "#3f4482"];
const frameProps = {
  /* --- Data --- */
  lines: [{
    title: "Activity", coordinates: [{ week: 1, grossWeekly: 327616, theaterCount: 4, theaterAvg: 81904, date: "2015-04-10", rank: 18 },
    { week: 2, grossWeekly: 1150814, theaterCount: 39, theaterAvg: 29508, date: "2015-04-17", rank: 15 }]
  }],

  /* --- Size --- */
  size: [900, 600],
  margin: { left: 80, bottom: 90, right: 10, top: 40 },

  /* --- Process --- */
  xAccessor: "week",
  yAccessor: "theaterCount",
  yExtent: [0],

  /* --- Customize --- */
  lineStyle: (d, i) => ({
    stroke: theme[i],
    strokeWidth: 2,
    fill: "none"
  }),
  title: (
    <text textAnchor="middle">
      Theaters showing <tspan fill={"#ac58e5"}>Ex Machina</tspan> vs{" "}
      <tspan fill={"#E0488B"}>Far from the Madding Crowd</tspan>
    </text>
  ),
  axes: [{ orient: "left", label: "Number of Theaters", tickFormat: function (e) { return e / 1e3 + "k" } },
  { orient: "bottom", label: { name: "Weeks from Opening Day", locationDistance: 55 } }]
};



class App extends Component {
  state = {
    user: '',
    userData: [],
    dataFormat: 'weekly'
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleFormatChange = () => {

  }

  handleSubmit = event => {
    event.preventDefault();
    API.getInfo(this.state.user)
      .then(res => {
        console.log(`List of Contributions per year`)
        // console.log(res.data.monthly)

        this.setState({
          userData: res.data.monthly
        })
        console.log(this.state.userData)

      })
  }


  render() {
    return (
      <div className='container'>
        <h1>This is a graph of my contributions this year</h1>
        <div className='input-field col s6'>
          <input id='user' name='user' value={this.state.user} onChange={this.handleInputChange} type='text' className='validate'></input>
          <label htmlFor='user'>User</label>
        </div>
        <button className='btn' onClick={this.handleSubmit}>Submit</button>

        <h2>Victory</h2>
        {this.state.userData.length !== 0 ?
          <VictoryChart
          // theme={VictoryTheme.material}
          >
            <VictoryLine
              name='monthly'
              interpolation='natural'
              domain={{ x: [200, 220], y: [0, 50] }}
              style={{
                data: { stroke: '#c43a31' },
                parent: { border: '0.5px solid #ccc' }
              }}
              data={this.state.userData}
              x='date'
              y='count'
            />
          </VictoryChart>
          : ''}

        {/* <h2>D3js</h2>
        <svg></svg> */}

        <h2>Semiotic</h2>
        <XYFrame
          title='Monthly Activity'
          points={this.state.userData}
          pointStyle={{ fill: 'blue' }}
          xAccessor={'date'}
          yAccessor={'count'}
          xScaleType={scaleTime()}

        // size={[800, 600]}
        // xAccessor={'date'}
        // yAccessor={'count'}
        // lines={[{ title: 'Monthly Activity', coordinates: this.state.userData }]}
        // lineStyle={d => ({ stroke: d.color, fill: d.color })}
        // {...frameProps}
        />



      </div >
    );
  }

}
export default App;
