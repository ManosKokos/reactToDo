import React from 'react';
import ReactDOM from 'react-dom';
import Grid from '@material-ui/core/Grid';
import './index.css';

function radioButton(){
    return (
        <radioButtons > 
            
        </radioButtons>        
    )
}


class RadioGroup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedValue : 'Search'
        };
    
        this.radioChange = this.radioChange.bind(this);
    }

    radioChange(e) {
        this.setState({
            selectedValue : e.currentTarget.value
        });
    }

    render(){
        return(
            <div>
                <input  type='radio'
                        value='Search'
                        checked= {this.selectedValue === 'Search'}
                        onChange= {this.radioChange}/>Search City
                <br/>
                <input  type='radio'
                        value='Select'
                        checked= {this.selectedValue === 'Select'}
                        onChange= {this.radioChange}/>Select City
            </div>
        );
    }
}



class WeatherForecast extends React.Component{
    render(){
        return (
            <div style={{
                position: 'absolute', left: '50%', top: '10%',
                transform: 'translate(-50%, -50%)'
            }}> 
                <h1 style={{
                    color:'red',
                    }}>WEATHER FORECAST</h1>
                <RadioGroup/>
                <Forecast/>
            </div>
        );
    } 
}


ReactDOM.render(
    <WeatherForecast />,
    document.getElementById('root')
  );