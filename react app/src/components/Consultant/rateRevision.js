import React, {Component} from 'react';
import "../../App.css";
import {Button,Modal} from "antd";
//Include the react-fusioncharts component
import ReactFC from 'react-fusioncharts';
//Include the fusioncharts library
import FusionCharts from 'fusioncharts';
//Include the chart type
import Column2D from 'fusioncharts/fusioncharts.charts';
//Include the theme as fusion
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import {Table} from "antd";
import {getRateRevision} from "../../services/service";
import RateRevisionForm from "./popupForm/rateRevision";
//Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

// Resolves charts dependancy
charts(FusionCharts);

const dataSource = {
    chart: {
        caption: "Rate revision history",
        yaxisname: "Rate in $",
        subcaption: "[2015-2019]",
        numbersuffix: "$",
        rotatelabels: "10",
        setadaptiveymin: "1",
        theme: "fusion"
    },
    data: [
        {
            label: "2015",
            value: "35"
        },
        {
            label: "2016",
            value: "42"
        },
        {
            label: "2017",
            value: "50"
        },
        {
            label: "2018",
            value: "59"
        },
        {
            label: "2019",
            value: "70"
        },
    ]
};
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

class RateRevision extends Component {
    constructor(props) {
        super(props);
        this.state = {
            revisionData: [],
            dataSource:{},
            openModal:false
        }

    }
    componentDidMount() {
        this.getRateRevision();
    }

    getRateRevision(){
        let data =[];
        let value ={};
        let dataSource={}
        getRateRevision(this.props.consultantId)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {

                res.results.map((ele,index)=>{
                    value={
                        'label': new Date(ele.start).getFullYear(),
                        'value':ele.rate
                    }
                    data.push(value)
                })

                dataSource = {
                    chart: {
                        caption: "Rate revision history",
                        yaxisname: "Rate in $",
                        subcaption: "[2015-2028]",
                        numbersuffix: "$",
                        rotatelabels: "10",
                        setadaptiveymin: "1",
                        theme: "fusion"
                    },
                    data: data
                };
                this.setState({
                    revisionData: res.results,
                    dataSource: dataSource
                })

            })
            .catch(error => {
                console.log(error);
            });
    }
    setRateRevisedData=(data)=>{
        let array=this.state.revisionData;
        array.push(data);
        this.setState({
            revisionData:array
        })
    }

    openModal =()=>{
        this.setState({
            openModal:true
        })
    }
    handleClose =()=>{
        this.setState({
            openModal:false
        })
    }
    render() {
        const columns = [
            {
                title: 'Effective Date',
                dataIndex: 'start',
                key: 'start',
                width: '10%',
                render: (text) => (
                    <span>{new Date(text).toLocaleDateString()}
                    </span>

                ),
            },
            // {
            //     title: 'Payout Month',
            //     dataIndex: 'payout_month',
            //     key: 'payout_month',
            //     width: '8%',
            //     render: (text) => (
            //         <span>{monthNames[new Date(text).getMonth()] +"-"+ new Date(text).getFullYear()}
            //         </span>
            //
            //     ),
            // },
            {
                title: 'Rate',
                dataIndex: 'rate',
                key: 'rate',
                width: '7%',
                render: (text) => (
                    <span>{text}
                    </span>

                ),
            },
            {
                title: 'Prev Rate',
                dataIndex: 'previous_rate',
                key: 'previous_rate',
                width: '7%',
                render: (text) => (
                    <span>{text}
                    </span>

                ),
            },
            {
                title: 'Difference',
                key: 'diff',
                width: '4%',
                render: (record) => (
                    <span>{(record.rate) - (record.previous_rate)}
                    </span>

                ),

            },
            {
                title: 'Percent',
                key: 'percent',
                width: '5%',
                render: (record) => (
                    <span>+ {
                        record.previous_rate !== 0?
                        (((record.rate) - (record.previous_rate)) / (record.rate)).toFixed(2):
                            0
                    } %
                    </span>

                ),
            }];
        return (
            <div className="revisiontab">
                <div className="row">
                <div className="col-md-8">
                <Table pagination={false} columns={columns} dataSource={this.state.revisionData}/>
              </div>

                <div className="col-md-4" style={{marginTop:'-70px'}}>

                    <ReactFusioncharts
                        type="line"
                        dataFormat="JSON"
                        dataSource={this.state.dataSource}
                    />
                </div>
                    <Button onClick={this.openModal} variant="primary">Revise Rate</Button>
                </div>
                {this.state.openModal &&
                <Modal
                    visible={this.state.openModal}
                   onCancel={this.handleClose}
                    footer={null}
                >
                    <RateRevisionForm
                        consultantId={this.props.consultantId}
                        handleClose={this.handleClose}
                        setRateRevisedData={this.setRateRevisedData}
                    />

                </Modal>}
            </div>
        );
    }
}

export default RateRevision
