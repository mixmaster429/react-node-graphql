import React, { Component } from "react";

const ProductContext = React.createContext();

var initialState = {
    make: "",
    model: "",
    category: "",
    categoryId: 0,
    type: "",
    year: "",
    bodyType: "",
    transmission: "",
    fuelType: "",
    seats: "",
    mileage: "",
    unit: "",
    service: "",
    serviceCategory: "",
    sellingStatus: "",
    status: "",
    userId: "",
    editData: {},
    errors: {},
    categories: [],
    images: [],
    imagePreviewUrl: [],
    deleteImages: [],
    validCount: 0,
    title: "",
    description: "",
    isFree: true,
    rate: 0,
    likedUsers: "",
    viewers: "",
    currencyCode: "",
    defaultCurrency: "",
    popUpDetails: [],
    loading: false,
    lat: '',
    lng: '',
    center: {
      lat: 40.748817,
      lng: -73.985428
    },
    bounds: null,
    location: {
      lat: 40.748817,
      lng: -73.985428
    },
   
    categoryError: false,
    locationError: false,
    titleError: false,
    descError: false,
    AdvancedFilter: {}
  };

export class ProductProvider extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             mystate: "no_product",
             beforeLoginState: initialState,
             discardStuff: Math.floor(Math.random() * 10000),
             imageAdded: Math.floor(Math.random() * 10000),
             userEditClicked: Math.floor(Math.random() * 10000), 
             categorySubmitted: Math.floor(Math.random() * 10000),
             HomePageFilterActiveId : 4,
             postAnotherListing: Math.floor(Math.random() * 10000),
             stuffImageEdit: Math.floor(Math.random() * 10000),
             FilterValue: Math.floor(Math.random() * 10000),
             clickPosting: Math.floor(Math.random() * 10000),
             postDone: Math.floor(Math.random() * 10000),
             PopupHide: Math.floor(Math.random() * 10000)
        }
    }
    

    AdvancedFiltersubmit = (stateName) => {
        //console.log(stateName)
        this.setState({ AdvancedFilter: (stateName),
            FilterValue: Math.floor(Math.random() * 10000), 
        })
    }

    PostProduct = () => {
        this.setState({
            postAnotherListing: Math.floor(Math.random() * 10000),
        })
    }

    getAllProducts = (data1) => {
        let Rand = Math.floor(Math.random() * 10000)
        this.setState({
            mystate : `${Rand}_added_product`
        })
        return true;
    }

    sellYourStuffBeforeLogin = (stuff) => {
        this.setState({
            beforeLoginState : stuff            
        })        
    }

    discardYourStuff = () => {
        this.setState({
            discardStuff : Math.floor(Math.random() * 10000)            
        })        
    }

    CategoryWithImage = () => {
        this.setState({
            imageAdded: Math.floor(Math.random() * 10000) 
        })
    }

    CategoryWithImageEdit = () => {
        this.setState({
            stuffImageEdit: Math.floor(Math.random() * 10000) 
        })
    }

    userEditActivated = () => {
        this.setState({
            userEditClicked: Math.floor(Math.random() * 10000) 
        })        
    }

    HomePageFilterFunction = async(id) => {
        await this.setState({
            HomePageFilterActiveId: id
        })        
    }

    CategorySubmittedinProducts = () => {        
        this.setState({
            categorySubmitted: Math.floor(Math.random() * 10000) 
        })          
    }

    clearValue = () =>{
        this.setState({
            clickPosting: Math.floor(Math.random() * 10000) 
        })   
    }
    showValue = () =>{
        this.setState({
            postDone: Math.floor(Math.random() * 10000)
        })
    }
    HidePopup = () =>{
        this.setState({
            PopupHide: Math.floor(Math.random() * 10000)
        })
    }
    render() {
        return (
            <ProductContext.Provider
            value={{
                ApigetAllProducts: this.getAllProducts,
                mystate: this.state.mystate,
                sellYourStuffBeforeLogin: this.sellYourStuffBeforeLogin,
                stuffValue: this.state.beforeLoginState,
                discardYourStuff: this.discardYourStuff,
                discardStuff: this.state.discardStuff,
                CategoryWithImage: this.CategoryWithImage,
                stuffImage: this.state.imageAdded,
                userEditClicked: this.state.userEditClicked,
                userEditActivated: this.userEditActivated,
                HomePageFilterActiveId: this.state.HomePageFilterActiveId,
                HomePageFilterFunction: this.HomePageFilterFunction,
                CategorySubmittedinProducts: this.CategorySubmittedinProducts,
                categorySubmitted: this.state.categorySubmitted,
                PostProduct: this.PostProduct,
                clearValue: this.clearValue,
                showValue: this.showValue,
                HidePopup: this.HidePopup,
                clickPosting:this.state.clickPosting,
                postDone: this.state.postDone,
                PopupHide: this.state.PopupHide,
                postAnotherListing: this.state.postAnotherListing,

                CategoryWithImageEdit: this.CategoryWithImageEdit,
                stuffImageEdit: this.state.stuffImageEdit,

                AdvancedFilter: this.state.AdvancedFilter,
                AdvancedFiltersubmit:  this.AdvancedFiltersubmit,
                FilterValue: this.state.FilterValue,

            }}
            >
                {this.props.children}
            </ProductContext.Provider>
        )
    }
}
export const ProductConsumer = ProductContext.Consumer;
export const ProviderRefech = ProductProvider;
