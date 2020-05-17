import React, {Component} from 'react';
import {Result} from "antd";

class HTTP_500 extends Component {

    render() {
        return (

            <div>
                <Result
                    status="500"
                    title="Internal Server Error"
                    subTitle="Sorry, the server is wrong."
                />
            </div>
        )
    }
}

export default HTTP_500;
