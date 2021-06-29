import React from "react";
import { compose, graphql } from "react-apollo";

// react component for creating dynamic tables
import ReactTable from "react-table";
import "react-table/react-table.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import {GET_TRANSACTIONS_DETAILS} from "../../../queries";
import {downloadCSV, onTableViewChange, downloadXLSX, exportData, getSymbol} from "../../../helper.js";
// style component
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";
const keys = [
  {key: "transactionId", value: "Transaction Id"},
  {key: "productName", value: "Product Name"},
  {key: "productuserName", value: "User Name"},
  {key: "amount", value: "Amount"},
  {key: "paymentType", value: "Payment Type"},
  {key: "createdAt", value: "Created At"},
];

const styles = {  
  
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  buttonStyle:{
    float: "right",
    position: "relative",
    marginTop: "20px"
  },
  smallButton: {
    marginRight: "5px",
    backgroundColor: "#00acc1 !important",
    marginTop: "25px"
  }
};


class TransactionList extends React.Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.state = {
      popUpDetails: "",
      canDelete: false,
      open: false,
      currentChosen: {},
      data: []
    };
    this.dataMapper = this.dataMapper.bind(this);
  }

  onTableChange = () => {
    this.setState({
      dataToexport: onTableViewChange(this.reactTable.current)
    });
}
  
  dataMapper(props) {
  var {getTransactionDetails} = props;
  let paymentCardType;
    if (getTransactionDetails && getTransactionDetails.getTransactionDetails) {
        this.setState({
          data: getTransactionDetails.getTransactionDetails.map((transact, key) => {
            console.log(transact)
            if(transact.paymentInstrumentType === "credit_card"){
              paymentCardType = "Credit card";
            }else if(transact.paymentInstrumentType === "paypal_account"){
              paymentCardType = "Paypal";
            }else{
              paymentCardType = "Stripe card"
            }
            return {
              transactionId: transact.transactionId,
              //paymentInstrumentType: transact.paymentInstrumentType,
              //status: transact.status,
              // amount: getSymbol(transact.currencyIsoCode) + transact.amount,
              createdAt: new Date(transact.createdAt).toLocaleString(),
              amount: getSymbol(transact.currencySymbol)+transact.amount,
              productName:transact.productName,
              productuserName: transact.productuserName,
              paymentType : paymentCardType
            };
          })
        });
      }
  }

  componentWillMount() {
    let {getTransactionDetails} = this.props;
    getTransactionDetails.refetch();
    if (getTransactionDetails) {
      this.dataMapper(this.props);
    }
  }


  componentWillReceiveProps(nextProps) {
    this.dataMapper(nextProps);
  }
  render() {
    const { classes } = this.props;
    let {dataToexport} = this.state;
    return (
      <GridContainer>
        <GridItem xs={12}>
          <Card>
          <CardHeader  icon>
          <Button
            
            size="sm"
            className={classes.smallButton}
            onClick={(e) => {
              downloadCSV(
              e,
              exportData(dataToexport ? dataToexport : this.reactTable.current.getResolvedState().sortedData.slice(0, 10), keys)
                );}}>CSV</Button>
          <Button
            
            size="sm"
            className={classes.smallButton}
            onClick={(e) => {
              downloadXLSX(
              e,
              exportData(dataToexport ? dataToexport : this.reactTable.current.getResolvedState().sortedData.slice(0, 10), keys)
                );}}>Excel</Button>
            </CardHeader>
            <CardBody>
              <ReactTable
                data={this.state.data}
                minRows={0}
                ref={this.reactTable} 
                onPageChange={this.onTableChange}
                onPageSizeChange={this.onTableChange}
                onSortedChange={this.onTableChange}
                onExpandedChange={this.onTableChange} 
                onFilteredChange={this.onTableChange}
                onResizedChange={this.onTableChange}
                filterable
                columns={[
                  {
                    Header: "Transaction Id",
                    accessor: "transactionId",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    sortMethod: (a, b, desc) => {
                      // force null and undefined to the bottom
                      a = a === null || a === undefined ? -Infinity : a;
                      b = b === null || b === undefined ? -Infinity : b;
                      // force any string values to lowercase
                      a = typeof a === "string" ? Number(a) : a;
                      b = typeof b === "string" ? Number(b) : b;
                      // Return either 1 or -1 to indicate a sort priority
                      if (a > b) {
                        return 1;
                      }
                      if (a < b) {
                        return -1;
                      }
                      // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
                      return 0;
                    }
                  },
                  // {
                  //   Header: "Payment Instrument Type",
                  //   accessor: "paymentInstrumentType",
                  //   style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                   
                  // },
                  {
                    Header: "User Name",
                    accessor: "productuserName",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                  },
                  {
                    Header: "Product Name",
                    accessor: "productName",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                  },
                  {
                    Header: "Amount",
                    accessor: "amount",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                  },
                  {
                    Header: "Payment Type",
                    accessor: "paymentType",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined  && row[filter.id] !== null) ?
                        String(row[filter.id].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true
                      );
                    }
                  },
                  // {
                  //   Header: "Status",
                  //   accessor: "status",
                  //   style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                  // },
                  {
                    Header: "Created At",
                    accessor: "createdAt",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                  },

                ]}
                defaultSorted={[
                  {
                    id: "id",
                    desc: true
                  }
                ]}
                defaultPageSize={10}
                // showPaginationTop={false}
                // showPaginationBottom={true}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

var TL = compose(
  graphql(GET_TRANSACTIONS_DETAILS, {
    name: "getTransactionDetails"
  })
)(TransactionList);

export default withStyles(styles)(TL);

