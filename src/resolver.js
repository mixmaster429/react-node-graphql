
export const defaults = { 
    toggleStatus: false,
    message: '',
    isOpen: false,
    inActive: false,
    open: false,
    categoryId:'',
    productId:'',
    searchInput:'',
    lat_lon:[],
    min:'',
    max:'',
    sort:'',
    sortDate:"",
    rosterGroupId:'',
    pageCount: false,
    closeModel: false,
    categoryRefetch: false,
    pageCountFilter:false,
    radius:"",
    locationName:"",
    resetButton: false,
    chatNow: false
 };

export const resolvers = {
  Mutation: {
    toggle: (_, { toggleStatus, message }, { cache }) => {
      cache.writeData({ data: {
        toggleStatus,
        message
            }
          });
      return null;
    },
    updateLoginPopupState: (_, { isOpen }, { cache }) => {
      cache.writeData(
        {
        data: {isOpen}
      }
      );
      return null;
    },
    inActiveScreen:  (_, { inActive }, { cache }) => {
      cache.writeData(
        {
        data: {inActive}
      }
      );
      //console.log(inActive)
      return null;
    },
    isOpen:  (_, { open }, { cache }) => {
      cache.writeData(
        {
        data: {open}
      }
      );
      return null;
    },
    redirectHome:  (_, { pageCount }, { cache }) => {
      cache.writeData(
        {
        data: {pageCount}
      }
      );
      return null;
    },
    redirectHomeFilter:  (_, { pageCountFilter }, { cache }) => {
      cache.writeData(
        {
        data: {pageCountFilter}
      }
      );
      return null;
    },
    getCategoryId :(_,{categoryId},{cache}) =>{
      cache.writeData(
        {
          data: {categoryId}
        }
      );
      return null;
    },

    getProductId :(_,{productId},{cache}) =>{
      cache.writeData(
        {
          data: {productId}
        }
      );
      return null;
    },  
    isModelClose:(_,{closeModel},{cache}) =>{
      cache.writeData(
        {
          data: {closeModel}
        }
      );
      return null;
    },

    getRefetch:(_,{categoryRefetch},{cache}) =>{
      cache.writeData(
        {
          data: {categoryRefetch}
        }
      );
      return null;
    },

    searchResult :(_,{searchInput},{cache}) =>{
      cache.writeData(
        {
          data:{searchInput}
        }
      );
      return null;
    },
    getLocation:(_,{lat_lon},{cache}) =>{
      cache.writeData(
        {
          data:{lat_lon}
      }
      );
      return null;
    },
    getRadius:(_,{radius},{cache}) => {
      cache.writeData(
        {
          data:{radius}
        }
      );
      return null;
    },
    getPrice:(_,{min,max},{cache}) =>{
      cache.writeData(
        {
          data:{
            min,
            max
        }
        });
      return null;
    },
    getSortBy:(_,{sort},{cache}) =>{
      cache.writeData(
        {
          data:{sort}
        });
      return null;
    },
    getRosterGroupId:(_,{rosterGroupId},{cache}) =>{
      cache.writeData(
        {
          data:{rosterGroupId}
        });
      return null;
    },
    getDateBy:(_,{ sortDate },{cache}) =>{
      cache.writeData(
        {
          data:{sortDate}
        });

      return null;
    },
  getLocationName:(_,{locationName},{cache}) => {
    cache.writeData(
      {
        data:{locationName}
      });
    return null;
  },
  updateResetButton:(_,{resetButton},{cache}) => {
    cache.writeData(
      {
        data:{resetButton}
      });
    return null;
    },
    updateChatNowStatus:(_,{chatNow},{cache}) => {
      cache.writeData(
        {
          data:{chatNow}
        });
      return null;
    }
  } 
}
