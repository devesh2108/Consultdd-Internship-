import React, {Component} from 'react';
import 'antd/dist/antd.css';


class ConsultantSuggestions extends Component {

    render() {

        return (
                <div>
                    This consultant is already submitted on this vendor:
                    <br/>
                    {this.props.suggestions.map((item) =>

                        <div>
                            <div>
                                <h6>Consultant: {item.consultant_name}</h6>
                                <h6>Marketer: {item.marketer_name}</h6>
                                <h6>Vendor: {item.company_name}</h6>
                                <h6>Location: {item.city}</h6>
                                <h6>Job Title: {item.job_title}</h6>
                            </div>
                            <br/>

                        </div>
                    )}
                </div>

        );
    }
}

export default ConsultantSuggestions;
