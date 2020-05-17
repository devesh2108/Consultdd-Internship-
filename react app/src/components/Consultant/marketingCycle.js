import React, {Component} from 'react';
import "../../App.css";
import {Checkbox} from "antd"
import moment from "moment-timezone"
import {getMarketingCycle} from '../../services/service'
import HTTP_400 from "../Error/HTTP_400";
import HTTP_500 from "../Error/HTTP_500";
import HTTP_404 from "../Error/HTTP_404";


class MarketingCycle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cycleData: [],
            status: 0

        }
    }

    componentDidMount() {
        this.getCycleData(this.props.consultantId);
    }

    getCycleData = (id) => {
        getMarketingCycle(id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res.result)
                if (status === 202) {
                    this.setState({
                        cycleData: res.result,
                    });

                } else {
                    this.setState({
                        cycleData: [],
                    });
                }
                this.setState({
                    status: status
                })

            })
            .catch(error => {
                console.log(error);
            });
    }


    render() {
        return (

this.state.status === 202?

            this.state.cycleData.map((data, i) =>
                <div>
                    <h2><span>Cycle:</span>{data.cycle}</h2>
                    {data.status === "open" ? <span>Active Cycle</span> : <span>Closed Cycle</span>}
                    <span>RTG:{data.rtg ?"Yes":"No"}</span>
                    <span> In Pool:{data.in_pool ?"Yes":"No"}/></span>
                    <span>Start Date:{moment(data.start).format("YYYY-MM-DD")}</span>
                    <span>End Date:{moment(data.end).format("YYYY-MM-DD")}</span>
                    <span>Primary Marketer: {data.primary_marketer__employee_name}</span>
                    <span>Team: {data.primary_marketer__team__name}</span>
                </div>
            )
    :
    this.state.status === 400 ?
        <HTTP_400/>
        :this.state.status === 500?
        <HTTP_500/>
        :
        this.state.status === 404 ?
            <HTTP_404/>

:null
    )
    }
}

                export default MarketingCycle;
