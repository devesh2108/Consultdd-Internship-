import React, {Component} from 'react';
import {Result,Button} from "antd";

class HTTP_401 extends Component {
 onReturnBack=()=>{
     localStorage.removeItem('TOKEN');
     localStorage.removeItem('TEAM');
     localStorage.removeItem('ROLE');
     localStorage.removeItem('ID');
     localStorage.removeItem('NAME');
     this.props.history.push('/login')
 }
    render() {
        return (

            <div>
                <Result
                    status="401"
                    title="Token Expired"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button type="primary" onClick={this.onReturnBack}>Back Home</Button>}
                />
            </div>
        )
    }
}

export default HTTP_401;
