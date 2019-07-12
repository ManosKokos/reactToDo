import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import './index.css';

/* eslint-disable no-unused-expressions */

class RadioController extends React.Component {
    constructor(props){
        super(props);

    }

    render(){
        return(
            <div>
                <input  type='radio'
                        value='Select'
                        checked=  {this.props.select}
                        onChange= {this.props.radioChange}/>Select City
                <br/><br/><br/>
                <input  type='radio'
                        value='Search'
                        checked= {!this.props.select}
                        onChange= {this.props.radioChange}/>Search City
            </div>
        );
    }
}



class WeatherForecast extends React.Component{
    constructor(props){
        super(props);

        this.state= { 
            loadedResponce : false,
            info : 'pending',
            select : true,
            selectedValue: '',
            searchValue: ''
        }; 
        
        this.loadedResponceOutput = this.loadedResponceOutput.bind(this);
        this.addNotification = this.addNotification.bind(this);
        this.notificationDOMRef = React.createRef();
    }

    addNotification(msg) {
        this.notificationDOMRef.current.addNotification({
            title: "Info",
            message: msg,
            type: "warning",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: { duration: 2000 },
            dismissable: { click: true }
            });
    }

    radioChange = (e) => {
        this.setState({
            select : e.currentTarget.value != 'Search'
        });

    }

    changeDropdown = (e) => {
        this.setState( { selectedValue : e.value } );
    }

    changeSearch = (e) =>{
        console.log(e.currentTarget);
        this.setState( {searchValue : e.currentTarget.value });
        console.log( this.state );
        console.log( this.state );
    }

    infoPendingOutpout(){
        const cities = [
            { label : 'London, uk' , value : 'London, uk'},
            { label : 'Sitia, Crete' , value : 'Sitia, Crete'}
        ];

        let searchB = <button onClick={this.requestWeatherData} type="button" disabled={ this.state.select } >Search</button>;
        let selectB = <button onClick={this.requestWeatherData} type="button" disabled={ !this.state.select }  >Select</button>;

        this.radioChange = this.radioChange;
        var eS = <span>&nbsp;&nbsp;</span>;
        return (
            <Container >
                <ReactNotification ref={this.notificationDOMRef} />
                <h1 className="centered" style={{color:'red'}} >WEATHER FORECAST</h1>
                <Row className="centered">
                    <Col >
                        <RadioController radioChange={ this.radioChange } select={this.state.select}  />
                    </Col>
                    {eS}{eS}{eS}
                    <Col>
                        <Select onChange={this.changeDropdown}  options={cities} placeholder="Select a city" />
                        <br/>
                        <input value={this.state.searchValue} onChange={this.changeSearch} type="text" name="search info" placeholder="search"/>
                    </Col>
                    {eS}{eS}{eS}
                    <Col>
                        <Row>{selectB} </Row>
                        <br/>
                        <Row>{searchB} </Row>
                    </Col>
                </Row>
            </Container>);
    }

    
    requestWeatherData = () =>{
        if( (this.state.searchValue == '' && !this.state.select) || (this.state.selectedValue == '' && this.state.select)){
            var msg = (!this.state.select) ? "Must input search value" : "Must select a city";
            this.addNotification( msg );
            return;
        }

        this.setState( { info : 'requestSend' } )
        var url = "https://community-open-weather-map.p.rapidapi.com/forecast?q=";
        
        if(!this.state.select)
            url= url.concat(this.state.searchValue);
        else
            url= url.concat(this.state.selectedValue);

        fetch(url,
                {
                    headers:{
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Host' : 'community-open-weather-map.p.rapidapi.com',
                        'X-RapidAPI-Key'  : 'b05ce62099mshabba5fc7896b16ep162ec8jsnb36483ac9212'
                    },
                }
        ).then(res => res.json())
        .then(
            (result) => {
                console.log(result);
                
                this.setState({
                    result,
                    loadedResponce: true,
                });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                this.setState({
                    loadedResponce: true,
                    error
                });
            }
        );
    }

    getNewData=()=>{
        this.setState({ info:'pending' })
    }

    loadedResponceOutput= () =>{
        console.log(this.state.list);

        if(this.state.result.cod == "404")
            this.addNotification("Cannot find city, retry");
                

        var location = this.state.result.city.name+"  "+this.state.result.city.country;
        var data = this.state.result.list.slice(0,50);
        var eS = <span>&nbsp;&nbsp;</span> ;
        return (
            <Container>
                <h1 className="centered" style={{color:'red'}} >WEATHER FORECAST</h1>
                <div className="centered">
                    <h4 > {location} </h4> 
                    {eS}{eS}
                    <button type="button" onClick={this.getNewData} >Select another location</button>
                </div>
                <div>
                    <ul >
                        {
                            data.map((item, index) => ( 
                            <li key={index}> 
                                Temperature:    {item.main.temp-273.15} C      {eS}{eS}
                                Min:            {item.main.temp_min-273.15} C  {eS}{eS}
                                Max:            {item.main.temp_max-273.15} C  {eS}{eS}
                                Humidity:       {item.main.humidity}   {eS}{eS}
                                Date:           {item.dt_txt}
                                <br/><br/><br/>
                            </li> ))
                        }
                    </ul>
                </div>
            </Container> );
    }

    render(){
        var JSX;

        if(this.state.info == 'pending')
            JSX = this.infoPendingOutpout();
        else if (this.state.info == 'requestSend'){
            if(!this.state.loadedResponce){
                JSX = (
                    <Container>
                        <h1 className="centered" style={{color:'red'}} >WEATHER FORECAST</h1>
                        <h3 className="centered"> Loading Data </h3>
                    </Container>    
                    );
            }else{
                JSX = this.loadedResponceOutput();
            }
        }
        
        return JSX;
    } 
}


ReactDOM.render(
    <WeatherForecast />,
    document.getElementById('root')
  );