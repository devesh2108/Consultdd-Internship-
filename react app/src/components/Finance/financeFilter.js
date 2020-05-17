import React, {Component} from 'react';
import {Select} from "antd";
import {getAllConsultants} from "../../services/service";
import Search from "antd/es/input/Search";

class FinanceFilter extends Component {


    render() {
        return (
            <div>
                <Search
                    placeholder="Search"
                    style={{width:'150px',float:'left',marginLeft:'-10px'}}
                    className="financesearch"
                    value={this.props.query}
                    onChange={this.props.onSearch}
                    onSearch={this.props.onSearch}
                />

                <Select
                    showSearch
                    allowClear
                    style={{width:'150px', float:'right'}}
                    className="submissionselect"
                    placeholder="Select a consultant"
                    optionFilterProp="children"
                    onChange={(e) => {
                        this.props.onChange(e);
                    }}
                    onSearch={(e)=>{
                        this.props.searchConsultant(e);
                    }}
                >
                    {this.props.consultantList.map((item, i) => (
                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    ))}
                </Select>
            </div>
        )
    }
}

export default FinanceFilter;
