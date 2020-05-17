import React, {Component} from 'react';
import Geocode from "react-geocode";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} from "react-google-maps";
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import {getLeadByCity, getLeadDataByCity} from "../services/service";

Geocode.setApiKey("AIzaSyB1RZHlrWgGffvAwBUGvX_ChTOLoG9xrWg");
let MapWithAMarker;

class LeadMap extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            city: [],
            mapData: {},
            cityName: '',
            status: null
        };
        this.getLatLng = this.getLatLng.bind(this);
        this.getLeadDataByCity = this.getLeadDataByCity.bind(this);
    }

    componentWillMount() {
        this.getLatLng();
    }

    shouldComponentUpdate(nextProps) {

        //console.log("next , props","hidemap", nextProps.mapStatus,this.props.mapStatus,this.props.flagMap)
        let mapStatus = (this.props.mapStatus != nextProps.mapStatus)
        //console.log(mapStatus, "mapstatus")
        if(this.props.flagMap){
            return mapStatus;
        }
        else {
            return !mapStatus;
        }

    }
    getLatLng() {
        getLeadByCity()
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
                } else {
                    this.setState({mapData: res.results});

                    res.results.map((item, i) => (
                        Geocode.fromAddress(item.location).then(
                            response => {

                                const data = {
                                    cityName: item.location,
                                    lat: response.results[0].geometry.location.lat,
                                    lng: response.results[0].geometry.location.lng
                                }


                                this.state.city.push(data)
                                this.setState({status: status})
                                this.props.setHideStatus()

                            },
                            error => {
                                console.error(error);
                            }
                        )
                    ))
                }
            })

    }

    getLeadDataByCity(params) {
        getLeadDataByCity(params)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {

                this.props.mapLeadData(res.results)
                this.props.setMapStatus(true)
                this.props.setHideStatus()

            })
    }


    render() {
        console.log("render map", this.state.city)
        console.log("status", this.state.status)

        MapWithAMarker = withScriptjs(withGoogleMap(props =>
            <GoogleMap
                google={this.props.google}
                defaultZoom={4}
                defaultCenter={{lat: 37.8282, lng: -99.5795}}
            >{
                this.state.city.map((item, i) => (
                    <Marker
                        position={{lat: item.lat, lng: item.lng}}
                        key={i.toString()}
                        onClick={() => {
                            console.log(item.cityName.toLowerCase())
                            this.getLeadDataByCity(item.cityName.toLowerCase())
                        }}
                    >
                        {item.cityName != null ?
                            this.state.mapData.map((items, i) => (

                                    (items.location.toLowerCase() === item.cityName.toLowerCase()) ?
                                        <InfoBox
                                            key={i.toString()}
                                            defaultPosition={{lat: item.lat, lng: item.lng}}
                                            options={{closeBoxURL: ``, enableEventPropagation: true}}

                                        >
                                            <div style={{
                                                backgroundColor: `white`,
                                                opacity: 0.85,
                                                padding: `12px`,
                                                borderRadius: 10,
                                                borderColor: 'black'
                                            }}>
                                                <div style={{fontSize: `16px`, fontColor: `black`}}>
                                                    {items.total}
                                                </div>
                                            </div>
                                        </InfoBox> : null

                                )
                            ) : null
                        }
                    </Marker>
                ))
            }

            </GoogleMap>
        ))

        return (
            <div>

                <MapWithAMarker
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAT1B2wwTsU0OdM_132vuFDzcXvo-tM6Lw-tM6Lw&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{height: `100%`}}/>}
                    containerElement={<div style={{height: `300px`}}/>}
                    mapElement={<div style={{height: `100%`}}/>}
                />

            </div>


        );
    }
}

export default LeadMap;