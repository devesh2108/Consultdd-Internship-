import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Select, Button} from "antd";
import {
    editType,
    getMarketerList
} from "../../../services/service";

class RetentionForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            status: false,
            retention: {}
        }
    }

    componentDidMount() {
        this.getMarketerList()
    }

    getMarketerList() {

        getMarketerList()
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                if (status === 401) {
                    localStorage.removeItem('TOKEN');
                    localStorage.removeItem('TEAM');
                    localStorage.removeItem('ROLE');
                    localStorage.removeItem('ID');
                    localStorage.removeItem('NAME');
                    this.props.history.push('/login')
                } else {

                    this.setState({userList: res.results, status: true})
                }

            })
            .catch(error => {
                console.log(error)
            });
    }

    selectRetention(value) {
        let obj = {
            'employee_name': '',
            'email': '',
            'phone': ''
        }
        if (value != '') {
            this.state.userList.map((retention, index) => {
                if (retention.name === value) {
                    obj = {
                        'employee_name': retention.name,
                        'email': retention.email,
                    }
                    this.setState({retention: obj})
                }
            })

        }
    }

    editRetention = () => {
        const body = {
            'relation': this.state.retention.id
        }
        editType(this.props.retention.id, 'relation', body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                this.props.closeModal();
                this.props.setRetention(this.state.retention)

            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        return (
            this.state.status &&
            <div>
                <ul className="pop_sec">
                   <li> <label> Current retention: </label> <span> {this.props.retention.employee_name} </span> </li>
                </ul>
                <br/>
                <Select
                    showSearch
                    className="benchselect"
                    style={{width: '340px', marginTop: "10px", marginRight: "10px"}}
                    placeholder="User List"
                    optionFilterProp="children"
                    onChange={(e) => this.selectRetention(e)}
                    // value={this.state.retention.name}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {this.state.userList.map((item, i) => (
                        <Select.Option value={item.name} key={i}>{item.name}</Select.Option>
                    ))}
                </Select>
                <Button onClick={this.editRetention}>Submit</Button>
                {this.state.retention !== {} ?
                    <div>
                        {this.state.retention.name}
                        <br/>
                        {this.state.retention.email}
                    </div>
                    : null
                }

            </div>
        )

    }
}

export default RetentionForm;
