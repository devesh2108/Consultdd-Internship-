import React, {Component} from 'react';
import {DatePicker} from "antd";
import Search from "antd/es/input/Search";

class TimesheetFilter extends Component {

    render() {
        return (

            <div className="timesheet_datepicker_head">
                <DatePicker className="datepicker_test" placeholder="Week Start" value={this.props.startRange} onChange={this.props.onStartChange} style={{width:'150px',margin:'10px'}}/>

              
                <DatePicker placeholder="Week End" value={this.props.endRange} onChange={this.props.onEndChange} style={{width:'150px',margin:'10px'}}/>
               
                <Search
                    placeholder="Search Client/Vendor"
                    style={{width:'187px',margin:'10px'}}
                    value={this.props.query}
                    onChange={this.props.onSearch}
                    onSearch={this.props.onSearch}
                />
            </div>  
        )
    }
}

export default TimesheetFilter;
