import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Select, Button} from "antd";
import {
    getMarketerList,
    editPrimaryMarketer
} from "../../../services/service";

class PrimaryMarketerForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            status: false,
            primary_marketer: {}
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

    selectPrimaryMarketer(value) {
        let obj = {
            'employee_name': '',
            'email': '',
            'phone': ''
        }
        if (value != '') {
            this.state.userList.map((primary_marketer, index) => {
                if (primary_marketer.name === value) {
                    obj = {
                        'employee_name': primary_marketer.name,
                        'email': primary_marketer.email,
                    }
                    this.setState({primary_marketer: obj})
                }
            })

        }
    }

    editPrimaryMarketer = () => {
        const body = {
            'primary_marketer': this.state.primary_marketer.id
        }
        editPrimaryMarketer(this.props.marketing.id, body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                this.props.closeModal();
                this.props.setPrimaryMarketer(this.state.primary_marketer)

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
                     <li> <label> Current Primary Marketer: </label> <span> {this.props.marketing.primary_marketer.employee_name} </span> </li>
                </ul>
                
                <Select
                    showSearch
                    className="benchselect"
                    style={{width: '340px', marginTop: "10px",marginRight:"10px"}}
                    placeholder="User List"
                    optionFilterProp="children"
                    onChange={(e) => this.selectPrimaryMarketer(e)}
                    // value={this.state.primary_marketer.name}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {this.state.userList.map((item, i) => (
                        <Select.Option value={item.name} key={i}>{item.name}</Select.Option>
                    ))}
                </Select>

                <Button onClick={this.editPrimaryMarketer}>Submit</Button>


                {this.state.primary_marketer !== {} ?
                    <div>
                        {this.state.primary_marketer.name}
                        <br/>
                        {this.state.primary_marketer.email}
                    </div>
                    : null
                }

            </div>
        )

    }
}

export default PrimaryMarketerForm;
