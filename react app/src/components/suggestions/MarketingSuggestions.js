import React, {Component} from 'react';
import 'antd/dist/antd.css';


class MarketingSuggestions extends Component {

    render() {

        return (
            <div>
                <div>
                    This consultant is already submitted on this client:
                    <br/>
                    {this.props.suggestions.map((item) =>

                        <div>
                            <div>
                                <h6>Consultant: {item.consultant_name}</h6>
                                <h6>Marketer: {item.marketer_name}</h6>
                                <h6>Client: {item.client}</h6>
                                <h6>Location: {item.location}</h6>
                                <h6>Job Title: {item.job_title}</h6>
                            </div>
                            <br/>

                        </div>
                    )}
                </div>
            </div>

        );
    }
}

export default MarketingSuggestions;
