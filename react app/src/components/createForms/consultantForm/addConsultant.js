import React, {Component} from 'react';

import CreateConsultant from './createConsultant'
import UploadDocuments from './uploadDocuments'
import MarketingForm from "./marketingForm";

class AddConsultant extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            stepCount: 1,
            consultantId : 1,
        };
        this.changeStep = this.changeStep.bind(this);

    }

    changeStep(val,consultantId) {
        this.setState({
            stepCount: val,
            consultantId:consultantId
        })
    }

    render() {
        return (

            <div>
                
                <br/>
                <br/>
                <br/>

                {this.state.stepCount === 1 ?


                    <MarketingForm handleClose={this.props.handleClose} changeStepCount={this.changeStep} />
                    //<CreateConsultant handleClose={this.props.handleClose} changeStepCount={this.changeStep} />
                    :
                    <UploadDocuments consultantId={this.state.consultantId} handleClose={this.props.handleClose}/>
                }


            </div>


        );
    }
}

export default AddConsultant;
