import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Select, Button} from "antd";
import {
    createPOC,
    getMarketerList
} from "../../../services/service";

class POCForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            status: false,
            poc: {}
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

    selectPoc(value) {
        let obj = {
            'employee_name': '',
            'email': '',
            'phone': ''
        }
        if (value != '') {
            this.state.userList.map((poc, index) => {
                if (poc.name === value) {
                    obj = {
                        'id': poc.id,
                        'employee_name': poc.name,
                        'email': poc.email,
                    }
                    this.setState({poc: obj})
                }
            })

        }
    }

    createPoc = () => {
        const body = {
            'consultant': this.props.consultantId,
            'poc': this.state.poc.id,
            'poc_type': this.props.poc_type,
        };
        createPOC(body)
            .then((response) => {
                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                this.props.closeModal();
                if (this.props.poc_type === 'relation') {
                    this.props.setRetention(this.state.poc)
                } else {
                    this.props.setRecruiter(this.state.poc)
                }

            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        return (
            this.state.status &&
            <div>
                Current {this.props.poc_type === 'relation' ? 'Retention' : 'Recruiter'}:{this.props.poc_type === 'relation' ?
                this.props.retention !== null ?
                    this.props.retention.employee_name : "No Retention Assigned" :
                this.props.recruiter !== null ?
                    this.props.recruiter.employee_name : "No Recruiter Assigned"}
                <br/>
                <Select
                    showSearch
                    className="benchselect"
                    style={{width: '340px', marginTop: "10px", marginRight: "10px"}}
                    placeholder="User List"
                    optionFilterProp="children"
                    onChange={(e) => this.selectPoc(e)}
                    // value={this.state.poc.name}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {this.state.userList.map((item, i) => (
                        <Select.Option value={item.name} key={i}>{item.name}</Select.Option>
                    ))}
                </Select>
                <Button onClick={this.createPoc}>Submit</Button>
                {this.state.poc !== {} ?
                    <div>
                        {this.state.poc.name}
                        <br/>
                        {this.state.poc.email}
                    </div>
                    : null
                }

            </div>
        )

    }
}

export default POCForm;
