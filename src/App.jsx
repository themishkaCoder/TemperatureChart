import React, { Component } from 'react';
import './App.css';
import {VictoryChart, VictoryLine, VictoryTheme} from 'victory'

class App extends Component {
  ws = new WebSocket("ws://localhost:8999");
  state = {
    isConnected: 'disconnected',
    serverResponse: [],
    arrayForId: [],
    chartArrayFirst:[],
    chartArraySecond:[]
  }

  componentDidMount(){
    this.ws.onopen = ()=>{
      this.setState({isConnected: 'connected'})
      console.log('connected')

    }
    this.ws.onclose = ()=>{
      this.setState({isConnected: 'disconnected'})
      console.log('disconnected')
    }
    this.ws.onmessage = evnt => {
      const message = JSON.parse(evnt.data)

      this.state.serverResponse.push(message)
      this.setState({serverResponse: this.state.serverResponse})
      this.setState({arrayForId: message})

      this.state.serverResponse.map((item) => {

        if(item[0].data <= 100 && item[1].data <= 100){
          this.state.chartArrayFirst.push(item[0])
          this.setState({chartArrayFirst: this.state.chartArrayFirst})

          this.state.chartArraySecond.push(item[1])
          this.setState({chartArraySecond: this.state.chartArraySecond})
        }
      })
    }

  }
  render() {
    let dataChartFirst = [{x: '00:00:00', y: 0}]
    let dataChartSecond = [{x: '00:00:00', y: 0}]
    if(localStorage.getItem("firstArray") != null){
      JSON.parse(localStorage.getItem("firstArray")).map(el=>{
        dataChartFirst.push(el)
      })
    }else{
      dataChartFirst = [{x: '00:00:00', y: 0}]
    }

    if(localStorage.getItem("secondArray") != null){
      JSON.parse(localStorage.getItem("secondArray")).map(el=>{
        dataChartSecond.push(el)
      })
    }else{
      dataChartSecond = [{x: '00:00:00', y: 0}]
    }

    

    this.state.chartArrayFirst.map(item => {
      dataChartFirst.push({x: `${Math.round(new Date(item.timestamp).getHours())}:${Math.round(new Date(item.timestamp).getMinutes())}:${Math.round(new Date(item.timestamp).getSeconds())}`, y: item.data})
      console.log(dataChartFirst)
    })

    this.state.chartArraySecond.map(item => {
      dataChartSecond.push({x: `${Math.round(new Date(item.timestamp).getHours())}:${Math.round(new Date(item.timestamp).getMinutes())}:${Math.round(new Date(item.timestamp).getSeconds())}`, y: item.data})
    })
    
    setInterval(()=>{
      const arrayToSaveFirst = dataChartFirst
      const arrayToSaveSecond = dataChartSecond

      localStorage.setItem("firstArray", JSON.stringify(arrayToSaveFirst))
      localStorage.setItem("secondArray", JSON.stringify(arrayToSaveSecond))

    }, 300000)

    return (
      <div className="App">
        {/* <h1>Hello world</h1> */}
        <h2>Socket: {this.state.isConnected}</h2>
        {/* <button id="btn" onClick={this.handleOnClick}>
          Click Here
        </button> */}
        {this.state.arrayForId.map((item) => {
          return <li>ID:{item.id} Temperature: {item.temperature} C°</li>
        })}

        <div style={{width: 1000 + "px", margin: "0 auto"}}>
        <VictoryChart
          // theme={VictoryTheme.material}
          width={1200}
          height={500}
        >
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc"}
            }}
            data={dataChartFirst}
          />
          <VictoryLine
            style={{
              data: { stroke: "#030513" },
              parent: { border: "1px solid #ccc"}
            }}
            data={dataChartSecond}
          />
        </VictoryChart>
        </div>
      </div>
    );
  }
}

export default App;
