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
            searchValue: '',
            details : ''
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
        this.setState( {searchValue : e.currentTarget.value });
    }

    infoPendingOutpout(){
        const cities = [
            { label : 'London, uk' , value : 'London, uk'},
            { label : 'Sitia, Crete' , value : 'Sitia, Crete'},
            { label : 'Paris' , value : 'Paris, FR'},
            { label : 'Lisbon' , value : 'Lisbon'},
            { label : 'Berlin' , value : 'Berlin, GER'}
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

    getDailyinfo(data){
        var daily = [];

        data.map((item)=>{
            // debugger;

            if(daily.length == 0)            
                daily.push(item)
            else{
                const last = daily[daily.length-1].dt * 1000;
                const next = item.dt * 1000;

                // console.log("-----------------");
                // console.log( new Date(last).toDateString() );
                // console.log("-----------------");
                // console.log( new Date(next).toDateString() );
                
                // debugger;
                // debugger;
                if( next - last > 1000 * 3600 * 24){
                    daily.push(item);
                }
            }
    
        });

        return daily;
    }

    viewDetails=(item,e)=>{
        console.log(item);
        this.addNotification("details");

        this.setState({ 
            info : 'details',
            details : item
        })
    }

    loadedResponceOutput= () =>{
        
        var location = this.state.result.city.name+"  "+this.state.result.city.country;
        var data = this.getDailyinfo(this.state.result.list);
        // var data = this.state.result.list;
        var eS = <span>&nbsp;&nbsp;</span> ;
        var img ="http://openweathermap.org/img/wn/"+data[0].weather[0].icon+"@2x.png";
        return (
            <Container>
                <ReactNotification ref={this.notificationDOMRef} />
                <h1 className="centered" style={{color:'red'}} >WEATHER FORECAST</h1>
                <div className="centered">
                    <h4 > {location} </h4> 
                    {eS}{eS}
                    <button type="button" onClick={this.getNewData} >Select another location</button>
                </div>
                <Col className="toLeft">
                    <h3>Now</h3>
                    <img src={img} alt="icon" width="100" height="100" />
                </Col>
                <Col className="toRight">
                    <ul >
                        {
                            data.map((item, index) => ( 
                            <li onClick={(e)=>{this.viewDetails({inf:item,loc: location},e)}}  key={index} > 
                                <div className="clickable">
                                    Date:           { new Date(item.dt * 1000).toDateString() }
                                    {/* Temperature:    {(item.main.temp-273.15).toFixed(2) }       C   {eS}{eS} */}
                                    <br/><br/>
                                    Min:            {(item.main.temp_min-273.15).toFixed(2) }   &deg;C   {eS}{eS}
                                    Max:            {(item.main.temp_max-273.15).toFixed(2) }   &deg;C  {eS}{eS}
                                    <br/><br/>
                                </div>
                            </li> ))
                        }
                    </ul>
                </Col>
            </Container> );
    }


//     wind: {…}
// ​​​​
// deg: 330.166
// ​​​​
// speed: 4.32
// main: {…}
// ​​​​
    signalViewAll=()=>{
        this.setState({
            info: 'requestSend',
        });
    }

    getItemDetailsOutput=(item)=>{
        var location = item.loc;
        var eS = <span>&nbsp;&nbsp;</span> ;
        var img ="http://openweathermap.org/img/wn/"+item.inf.weather[0].icon+"@2x.png";

        return (
            <Container>
                <ReactNotification ref={this.notificationDOMRef} />
                <h1 className="centered" style={{color:'red'}} >WEATHER FORECAST</h1>
                <div className="centered">
                    <h4 > {location} details </h4> 
                    {eS}{eS}
                    <button onClick={this.signalViewAll} >Go Back</button>
                    <button type="button" onClick={this.getNewData} >Select another location</button>
                </div>
                <Col className="toLeft">
                    <h3>Now</h3>
                    <img src={img} alt="icon" width="100" height="100" />
                </Col>
                <Col className="toRight">
                    <div >
                        Date:           { (item.inf.dt_txt) }
                        <br/><br/>
                        Temperature:    {(item.inf.main.temp-273.15).toFixed(2) }       &deg;C   {eS}{eS}
                        <br/><br/>
                        Min:            {(item.inf.main.temp_min-273.15).toFixed(2) }  &deg;C   {eS}{eS}
                        Max:            {(item.inf.main.temp_max-273.15).toFixed(2) }   &deg;C   {eS}{eS}
                        <br/><br/>
                        Sea level:     {(item.inf.main.sea_level).toFixed(2) }  {eS}{eS}
                        Pressure:      {(item.inf.main.pressure).toFixed(2) }  
                        <br/><br/>
                        Humidity:      {(item.inf.main.humidity).toFixed(2) }  {eS}{eS}
                        Ground level:  {(item.inf.main.grnd_level).toFixed(2) }  {eS}{eS}
                        <br/><br/>
                        Wind degree:   {(item.inf.wind.deg).toFixed(2) }  {eS}{eS}
                        Wind speed:    {(item.inf.wind.speed).toFixed(2) }  {eS}{eS}
                    </div>
                    
                </Col>
            </Container> );
    }

    render(){
        var JSX;


        switch(this.state.info){

            case 'pending':
                JSX = this.infoPendingOutpout();
                break;

            case 'requestSend':
                
                if(!this.state.loadedResponce){
                    JSX = (
                        <Container>
                            <ReactNotification ref={this.notificationDOMRef} />
                            <h1 className="centered" style={{color:'red'}} >WEATHER FORECAST</h1>
                            <h3 className="centered"> Loading Data </h3>
                        </Container>    
                        );
                }else{
                    
                    switch(this.state.result.cod){
                        case'404':
                            this.addNotification("Cannot find city, retry");
                            this.setState({ info : 'pending'})
                            JSX = this.infoPendingOutpout();
                            break;
                        
                        case '200':
                            JSX = this.loadedResponceOutput();
                            break;

                        default:
                            this.addNotification("Unable to fetch data, retry");
                            this.setState({ info : 'pending'})
                            JSX = this.infoPendingOutpout();
                            break;
                    }
                }
                break;
                
                case'details':
                    JSX = this.getItemDetailsOutput(this.state.details);
                    break;

            default:
                JSX = this.infoPendingOutpout();
                console.log('You must not be seeing this');
                break;
        }

        return JSX;
    } 
}


ReactDOM.render(
    <WeatherForecast />,
    document.getElementById('root')
  );