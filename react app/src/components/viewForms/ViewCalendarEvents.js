import React, {Component} from 'react';
import moment from "moment-timezone";


export default class ViewCalendarEvents extends Component {
    constructor(props) {
        super(props);

    }


    render() {
console.log(this.props.interview)
        return (
            <div>
                <div class="viewhead"><h3> View Calendar Events </h3></div>
                <div className="calenderEve">
                    <h2></h2>
                    <h3>Title:{this.props.interview.title}</h3>
                    <div dangerouslySetInnerHTML={{__html:this.props.interview.description}}/>
                    <br/>
                    <h4>Schedule:
                        {new Date(this.props.interview.start).toDateString() + ": " + moment(this.props.interview.start).tz("America/Toronto").format("hh:mm A") + " to " + moment(this.props.interview.end).tz("America/Toronto").format("hh:mm A")}

                    </h4>
                </div>
            </div>
            
        );
    }
}

