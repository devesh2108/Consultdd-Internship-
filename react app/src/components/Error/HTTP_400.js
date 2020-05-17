import React, {Component} from 'react';
import {Result} from "antd";

class HTTP_400 extends Component {

    render() {
        return (

            <div>
                <Result
                    status="info"
                    title="No data Found"
                />
            </div>
        )
    }
}

export default HTTP_400;
