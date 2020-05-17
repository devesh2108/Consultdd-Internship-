import React, {Component} from 'react';
import {Result} from "antd";

class HTTP_404 extends Component {

    render() {
        return (

            <div>
                <Result
                    status="error"
                    title="Page not found"
                />
            </div>
        )
    }
}

export default HTTP_404;
