/* global google */
import React from "react";
import {graphql, compose } from "react-apollo";
import {compose as pose} from "recompose";

// react components used to create a google map
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
} from "react-google-maps";
import Geocode from "react-geocode";

// react components used for map searchbox
import {SearchBox} from "react-google-maps/lib/components/places/SearchBox";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import FormHelperText from  "@material-ui/core/FormHelperText";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";

// style component
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";

import marker from "../../../assets/img/marker.png";
import {mapLocation} from "../../../helper.js";
import {GET_SITE_INFO} from "../../../queries";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  }
};

var locationUpdate = document.getElementsByClassName("location");

const CustomSkinMap = pose(withScriptjs, withGoogleMap)((props) =>
{
  return   (
    <GoogleMap
    ref={props.onMapLoad}
    //onCenterChanged={props.onCenterChanged()}
    center={{lat: parseFloat(props.center.lat), lng: parseFloat(props.center.lng) }}
    //center={{ lat: props.center.lat, lng: props.center.lng }}
    defaultZoom={13}
    //defaultCenter={{ lat:props.lat, lng: props.lng }}
    onDragEnd={props.onDragEnd}
    onBoundsChanged={props.onBoundsChanged}
    defaultOptions={{
      scrollwheel: true,
      disableDefaultUI: true,
      defaultVisible:	true,
      zoomControl: true
    }
  }
  >
  <SearchBox
    ref={props.onSearchBoxMounted}
    onPlacesChanged={props.onPlacesChanged}
    bounds={props.bounds}
    controlPosition={google.maps.ControlPosition.TOP_LEFT}
  >
  <input
  type="text"
  className="location"
  placeholder="Add Address"
  style={{
  boxSizing: "border-box",
  border: "1px solid transparent",
  margin: "10px 10px 0 10px",
  width: "95%",
  height: "32px",
  padding: "0 12px",
  borderRadius: "3px",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
  fontSize: "14px",
  outline: "none",
  textOverflow: "ellipses"
  }}
  /></SearchBox>
  </GoogleMap>
  );
}
);

class LocationDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: "",
      lat:"",
      lng: "",
      center: {
        lat: 40.748817,
        lng: -73.985428,
      },
      bounds: null,
      location: {},
      editData: {}
    };

    // this.MarkPlace = this.MarkPlace.bind(this);
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapDrag = this.handleMapDrag.bind(this);
    this.handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
    this.handlePlacesChanged = this.handlePlacesChanged.bind(this);
    this.onBoundsChanged = this.onBoundsChanged.bind(this);

  }

  componentWillMount() {
    let {match, data, siteInfo} = this.props;
   const id = match.params.id;
    siteInfo.refetch();
    if (siteInfo.getSiteInfo) {
      let googleApi = siteInfo.getSiteInfo && siteInfo.getSiteInfo.googleApi;
      this.setState({ googleApi });
    }
      if (id) {
        let currentProduct = data.getAdminByProduct[0];
        if (currentProduct.location) {
          this.setState({
           location: currentProduct.location,
           //editData: currentProduct.location,
            lat: currentProduct.location.lat_lon[0],
            lng: currentProduct.location.lat_lon[1],
            center: {
              lat: currentProduct.location.lat_lon[0] ,
              lng: currentProduct.location.lat_lon[1]
            }
          });
        }
      }
  }

  componentWillReceiveProps(nextProps) {
    let {siteInfo} = nextProps;
    if (siteInfo.getSiteInfo) {
      let googleApi = siteInfo.getSiteInfo && siteInfo.getSiteInfo.googleApi;
      this.setState({ googleApi });
    }  
  }
      handleMapLoad(map) {
        this._mapComponent = map;
      }

      sendState() {
        return this.state;
      }

      isValidated() {
        if (this.state.location && Object.keys(this.state.location).length) {
          this.setState({
            errors: ""
          })
          return true;
        }
        this.setState({
          errors: "Location Should not be empty"
        })
        return false;
      }

      onBoundsChanged() {
        this.setState({
          bounds: this._mapComponent.getBounds(),
          center: this._mapComponent.getCenter()
        });
      }

 
      handleMapDrag() {
        let mapRef = this._mapComponent;
        let {match} = this.props;
        const id = match.params.id;
        this.setState({
          center: mapRef.getCenter()
        });
        // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
        Geocode.setApiKey(this.state.googleApi);
        // Enable or disable logs. Its optional.
        Geocode.enableDebug();
        // Get address from latidude & longitude.
        Geocode.fromLatLng(mapRef.getCenter().lat(), mapRef.getCenter().lng()).then(
          response => {
            const address = response.results[0].formatted_address;
            locationUpdate[0].value = address;
            const lat_lon = response.results[0].geometry.location;
            var locationSet = mapLocation(response.results);
            var location = {
              address:  locationSet.street_name ? locationSet.street_name : ""+ 
              locationSet.route ? locationSet.route : "",
              city: locationSet.locality || locationSet.administrative_area_level_2,
              state: locationSet.administrative_area_level_1,
              country: locationSet.country,
              pincode : locationSet.postal_code,
              lat_lon : [lat_lon.lat, lat_lon.lng]
            };
            this.setState({
              location: location,
              editData: id && {location},
              errors: ""
            });
          },
          (error) => {
            //console.error(error);
          }
        );
      }

      handleSearchBoxMounted(searchBox) {
        let {match} = this.props;
        const id = match.params.id;
        this._searchBox = searchBox; 
        let {location, googleApi} = this.state;
        let l = location.lat_lon && location.lat_lon.length ? location.lat_lon[0] : 40.748817;
        let lo = location.lat_lon && location.lat_lon.length ? location.lat_lon[1] : -73.985428;
        if (id && this.state.location && this._searchBox) {
          // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
          Geocode.setApiKey(googleApi);
        // Enable or disable logs. Its optional.Geocode.enableDebug();
          Geocode.fromLatLng(l, lo).then(
            (response) => {
              const address = response.results[0].formatted_address;
              if (this._searchBox && this._searchBox.containerElement) {
                this._searchBox.containerElement.getElementsByClassName("location")[0].value = address;
              }
            }, (error) => { 
              //console.error(error); 
            }
          );
        }
      }
    
      handlePlacesChanged() {
        let {match} = this.props;
        const id = match.params.id;
        const places = this._searchBox.getPlaces();
        if (places && places.length) {
          var locationSet = mapLocation(places);
          var location = {
            address:  locationSet.street_name ? locationSet.street_name : ""+
            locationSet.route ? locationSet.route : "",
            city: locationSet.locality || locationSet.administrative_area_level_2,
            state: locationSet.administrative_area_level_1,
            country: locationSet.country,
            pincode : locationSet.postal_code,
            lat_lon : [places[0].geometry.location.lat(), places[0].geometry.location.lng()]
          };
          this.setState({
            center: {
              lat: places[0].geometry.location.lat(),
              lng: places[0].geometry.location.lng()
            },
            location,
            editData: id && {location},
            errors: ""
          });
        }
      }

  render() {
    const { lat, lng, bounds, center, googleApi } = this.state;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
        <FormHelperText error={!!this.state.errors}>
        {this.state.errors + (this.state.errors ? " *" : "")}
        </FormHelperText>
           {
             googleApi && googleApi !== "undefined" ? <CardBody>
             <CustomSkinMap
               onBoundsChanged={this.onBoundsChanged}
               onMapLoad={this.handleMapLoad}
               onDragEnd={this.handleMapDrag}
               onSearchBoxMounted={this.handleSearchBoxMounted}
               bounds={bounds}
               onPlacesChanged={this.handlePlacesChanged}
               onCenterChanged={this.onCenterChanged}
               center={center}
               lat={lat}
               lng={lng}
               googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleApi}&libraries=places`}
               loadingElement={<div style={{ height: `100%` }} />}
               containerElement={
                 <div
                   style={{
                     height: "280px",
                     borderRadius: "6px",
                     overflow: "hidden"
                   }}
                 />
               }
               mapElement={<div style={{ height: "100%" }} />}
             />
             <img
             style={{
               position: "absolute",
               top: "50%",
               left: "50%"
             }}
                   src={marker} alt="..." />
             </CardBody> : ""
           } 
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}



var location = compose(
  graphql(GET_SITE_INFO, {name: "siteInfo"})
);

var enhance = withStyles(styles)(LocationDetails);

export default location(enhance);
