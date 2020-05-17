import React from 'react';

import 'antd/dist/antd.css';
import {Button, Input, message, Modal, Radio} from 'antd';

export default class PreJoiningFeedbackModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackDescription: '',
            communication:'',
            experience:'',
            problem_solving:'',
            role_related_knowledge:'',
            organizational_abilities:''
        };
        this.onChange = this.onChange.bind(this);

    }

    onChange = e => {
        this.setState({
            feedbackDescription: e.target.value,
        });
    };

    render() {

        return (
            <div style={{marginTop: '30px', width: '90%'}}>
                text
            </div>
        );
    }
}

