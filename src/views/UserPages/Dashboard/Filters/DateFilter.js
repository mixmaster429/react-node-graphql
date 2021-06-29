import React from 'react';
import '../../css/style.css'
import DateFilterController from './DateFilterController';
import { withTranslation, Trans } from 'react-i18next';

class DateFilter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            render: false,
            value: 'All listings'
        }
    }

    handleClick = (e) => {
        e.preventDefault();
        this.setState({render: !this.state.render});        
    }

    dataUpdate= (a) => {
        this.setState({value: a});
        this.props.change(a);
    }

    componentWillReceiveProps(nextprops) {
        if(nextprops.reset !== true){
            this.setState({value: this.props.t('Homepagefilter._AllLisings')});
        }
      }

    render(){
        const { classes, t, i18n,getDateByData } = this.props;
        const Dateoptions = [
            'Homepagefilter._AllLisings',  
            'Homepagefilter._last24', 
            'Homepagefilter._last7', 
            'Homepagefilter._last30'
        ]

        const sortDateValue = getDateByData &&  getDateByData.sortDate 
        ? Dateoptions.find((e,i) => i == getDateByData.sortDate) 
        : Dateoptions.find((e,i) => i == getDateByData)
           

           return(
            <div className="dropdown pric">
           
            <div className="location-filter respimg newpri price-filt dropdown-toggle" data-toggle="dropdown"
            onClick={this.handleClick}> 
             <div className="locatext locatingval">  {this.props.t('Homepagefilter._Posted')}</div> 
             <div className="etw locmap popress">
             { sortDateValue === undefined ? t("Homepagefilter._AllLisings") : t(sortDateValue) }
            </div>
            </div>
            <div class="dropdown-menu sortby">

            {this.state.render && 
            <DateFilterController value={this.dataUpdate} data={this.data} resetDate={this.props.resetDate}
            change={this.props.change} reset={this.props.reset} />
            }

            </div>
          </div>
        );
    }
}
export default withTranslation('common')(DateFilter);