import React, {Component} from 'react';

import AddLead from "../components/addLead";
import AddSubmission from "../components/addSubmission";
//
// const customStyles = {
//     content: {
//         top: '50%',
//         left: '50%',
//         right: 'auto',
//         bottom: 'auto',
//         marginRight: '-50%',
//         transform: 'translate(-50%, -50%)'
//     }
// };

class TwoStepForm extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            stepCount: 1,
            leadId : null,
            companyId:null
        };
        this.changeStep = this.changeStep.bind(this);

    }

    changeStep(val, id,cid) {
        this.setState({
            stepCount: val,
            leadId : id,
            companyId: cid
        })
    }

    render() {
        return (

            <div>
                    {this.state.stepCount === 1 ?
                        <AddLead handleClose={this.props.handleClose} addSub={this.props.addSub} openSubModal={this.props.openSubModal} changeStepCount={this.changeStep} getLead={this.props.getLead} setSubmission={this.props.setSubmission} /> :
                        <AddSubmission leadId={this.state.leadId} addSub={this.props.addSub} openSubModal={this.props.openSubModal} companyId={this.state.companyId} handleClose={this.props.handleClose} setSubmission={this.props.setSubmission}/>
                    }

            </div>


        );
    }
}

export default TwoStepForm;
