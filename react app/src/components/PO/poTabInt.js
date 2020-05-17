import React, {Component} from 'react';
import moment from 'moment-timezone'
export default class PoTabInt extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            flag:false
        }

    }

    componentDidMount() {

    }

    render() {

        return (
            <div className="intdatamain">
                <label> Interview Details: </label>
                {this.props.interview_details.map((item,i)=>(
                    <div className="intdata" style={{borderWidth:1}}>
                        <label>Round:</label>{item.round}
                        <br/>
                        <label>Supervisor:</label>{item.ctb === null ? null:item.ctb.full_name}
                        <br/>
                        <label> Type: </label>{item.type}
                        <br/>
                        <label> Description: </label>{item.description}
                        <br/>
                        <label> Start and End Time: </label>{moment(item.start_date).format("YYYY-MM-DD")+","+moment(item.start_date).format("hh:mm a")+" to "+moment(item.end_date).format("hh:mm a")}
                    </div>
                ))}
            </div>

        )

    }
}
