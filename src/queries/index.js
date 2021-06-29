import { gql } from "apollo-boost";

export const SIGNIN_USER = gql`
    mutation($userName: String!, $password: String!){
        adminLogin(userName: $userName, password: $password)
    }`;

export const UPDATE_ADMIN_USER = gql`
mutation($id: Int, $email: String, $password: String, $userName: String, $status: String, $role: String) {
    updateAdmin(data: {id: $id, email: $email, password: $password, userName: $userName, status: $status, role: $role})
}
`;

export const UPDATE_FEEDBACK = gql`
mutation($id: Int, $name: String, $description: String, $feedbackType: String, $status: String) {
    updateFeedBack(data: {id: $id, name: $name, description: $description, feedbackType: $feedbackType, status: $status})
}
`;

export const SIGNUP_USER = gql`
    mutation($email: String!, $password: String!, $userName: String!, $status: String!, $type: String) {
        signup(data: {email: $email, password: $password, userName: $userName, status: $status,  type: $type}) {
            result {
                userId
                token,
                userName,
                profileImage,
                status
            }
        }
    }`;


export const BULK_MAIL = gql`
mutation($data: bulkmailInfo) {
    bulkMail(data: $data)
}
`;

export const FORGOT_PASSWORD = gql`
    mutation forgotPassword($email:String!){
        forgotPassword(
          email: $email
        ){
        result
        }
      }
    `;

export const EDIT_USER = gql`
mutation($id: Int, $email: String, $password: String, $newPassword: String, $oldPassword: String, $userName: String, $status: String, $profileImage: String, $type: String) {
    editProfile(data: {id: $id, email: $email, password: $password, newPassword: $newPassword, oldPassword: $oldPassword,userName: $userName, status: $status, profileImage: $profileImage, type: $type}) {
            userName,
            status,
            password, 
            oldPassword,
            newPassword,
            email,
            profileImage
    }
}`;


export const ADD_CONTACT = gql`
mutation addContactUs($name:  String!, $email: String!, $feedback: String!) {
    addContactUs(name: $name, email: $email, feedback: $feedback ){
       name
       email
       feedback
      }
}`;


// password => confirmpassword
//currentPassword => oldpassword
export const LOG_OUT = gql`
mutation logOut($type: String) {
    logOut(type: $type)
}`;


export const LIKES_UPDATE = gql`
mutation likeUpdate($id:Int!){
    likesUpdate(id:$id){
        result
    }
  }`;

  export const UPDATE_PRODUCT_REPORTS = gql`
  mutation updateProductReports($productId:Int, $comments: String){
    updateProductReports(productId:$productId, comments:$comments)
  }`;


export const GET_ROSTER = gql`
query getRoster($type: String) {
    getRoster (type: $type) {
        userId
        groupId
        groupName
        isBlocked
        blockedBy
        userName
        profileImage
        role
        productName
        sellingStatus
        image
        productId
        currencyCode
        currencySymbol
        rate
        unreadMessage
    }
}
`;

export const CHATLIST_SUBSCRIPTION = gql`
  subscription newrosterAdded($userId: Int,$type:String){
    newrosterAdded(userId:$userId,type:$type){
        userId
        groupId
        groupName
        isBlocked
        blockedBy
        userName
        profileImage
        role
        productName
        sellingStatus
        image
        productId
        currencyCode
        currencySymbol
        rate
        unreadMessage
    }
}
`;
export const UPDATE_SELLING_STATUS = gql`
    mutation updateSellingStatus($id: Int!, $sellingStatus: String!) {
        updateSellingStatus(id: $id, sellingStatus: $sellingStatus) {
            status
            userInfo {
                id
                profileImage
                userName
            }
        }
    }
`;

export const UPDATE_PRODUCT = gql`
mutation updateProduct($id: Int, $data: ProductData) {
    updateProduct(id: $id, data: $data) {
        id
        language{
            langCode
            title
            description
            }
           
        userName
        userProfile
        userId
        images
        categoryId
        category
        viewers
        type
        likedUsers
        location {
            city
            state
            country
            lat_lon
            pincode,
            address
        }
        isFree
        createdAt
        updatedAt
        likedUsers
        sellingStatus
        status
        rate
        currencyCode
        currencySymbol
        viewersCount
        frequency
        groupsId
        groupsName
        featured
        featuredTransactionId
        featuredExpiry
        featuredName
        featuredValidation
        featuredDescription
        categoryFieldsInfo{
            fieldId
            fieldParent
            fieldChild
            rangeValue
        }
       
    }
}`;

export const RESET_PASSWORD = gql`
mutation resetPassword($input: ResetPasswordInput) {
    resetPassword(input: $input) 
}
`;



export const SEND_FEEDBACK = gql`
mutation sendFeedBack($data: FeedBackData) {
    sendFeedBack(data: $data)
}`;

// Get queries
    export const GET_ADMIN_USERS = gql`
    query {
        getAdminUsers {
            id
            createdAt
            updatedAt
            email
            userName
            status
            role
        }
    }
    `;

   

export const GET_ALL_USERS = gql`
    query {
        getAllUsers {
            id
            createdAt
            email
            userName
            status
            updatedAt
        }
    }
    `;

    export const GET_ALL_PRODUCTS = gql`
    query getAllProducts($filter: FilterInput, $pageNumber: String) {
        getAllProducts(filter: $filter, pageNumber: $pageNumber) {
            id
            language{
                langCode
                title
                description
            }
            title
            userName
            userId
            status
            sellingStatus
            sellingTimeStamp
            updatedAt
            viewers
            createdAt
            images
            likedUsers
            groupsId
            groupsName
            isFree
            description
            isDeleted
            deletedAt
            categoryId
            category
            rate
            currencyCode
            currencySymbol
            userProfile
            timeAgo
            viewersCount
            isFav
            viewed
            speedImage
            frequency
            chatType
            isNew
            isBlocked
            type
            featured
            featuredTransactionId
            featuredExpiry
            featuredName
            featuredValidation
            location {
                city
                state
                country
                lat_lon
                pincode,
                address
            }
        }
    }
    `;


export const GET_ALL_ADMIN_PRODUCTS = gql`
query getAllAdminProducts($filter: FilterInput) {
    getAllAdminProducts(filter: $filter) {
            id
            categoryFieldsInfo{
                fieldId
                fieldParent
                fieldChild
                rangeValue
           }
            language{
                langCode
                title
                description
            }
            userName
            userId
            status
            sellingStatus
            sellingTimeStamp
            updatedAt
            viewers
            createdAt
            images
            likedUsers
            groupsId
            groupsName
            isFree
            isDeleted
            deletedAt
            categoryId
            category
            rate
            currencyCode
            currencySymbol
            userProfile
            timeAgo
            viewersCount
            isFav
            viewed
            speedImage
            frequency
            chatType
            isNew
            isBlocked
            type
            location {
                city
                state
                country
                lat_lon
                pincode,
                address
            }
    }
}
`;
    export const UPDATE_CHAT_GROUP = gql`
    mutation updateChatGroup($ChatData: ChatData) {
        updateChatGroup(data: $ChatData) {
            userId
            groupId
            groupName
            userName
            imageUrl
            productName
            profileUrl
            sellingStatus
            productId
            currencyCode
            currencySymbol
            rate
        }
    }
    `;

    export const GET_PRODUCT = gql`
    query getProduct($id: Int) {
        getProduct(id: $id) {
            id
            categoryFieldsInfo{
                fieldId
                fieldParent
                fieldName
                fieldChildName
                fieldChild
                rangeValue
           }
            language{
                langCode
                title
                description
            }
            title
            description
            userName
            userProfile
            userId
            status
            sellingStatus
            sellingTimeStamp
            updatedAt
            viewers
            createdAt
            images
            likedUsers
            groupsId
            groupsName
            isFree
            isDeleted
            deletedAt
            categoryId
            category
            rate
            currencyCode
            currencySymbol
            userProfile
            timeAgo
            viewersCount
            isFav
            viewed
            speedImage
            frequency
            chatType
            isNew
            isBlocked
            type
            featured
            featuredTransactionId
            featuredExpiry
            featuredName
            featuredValidation
            location {
                city
                state
                country
                lat_lon
                pincode,
                address
            }
        }
    }
    `;

export const GET_ADMIN_BY_PRODUCT = gql`
query getAdminByProduct($id: Int) {
    getAdminByProduct(id: $id) {
            id
            categoryFieldsInfo{
                fieldId
                fieldParent
                fieldChild
                rangeValue
           }
            language{
                langCode
                title
                description
            }
            userName
            userId
            status
            sellingStatus
            sellingTimeStamp
            updatedAt
            viewers
            createdAt
            images
            likedUsers
            groupsId
            groupsName
            isFree
            isDeleted
            deletedAt
            categoryId
            category
            rate
            currencyCode
            currencySymbol
            userProfile
            timeAgo
            viewersCount
            isFav
            viewed
            speedImage
            frequency
            chatType
            isNew
            isBlocked
            type
            featured
            featuredTransactionId
            featuredExpiry
            featuredName
            featuredValidation
            location {
                city
                state
                country
                lat_lon
                pincode,
                address
            }
    }
}
`;
    

    export const GET_CURRENT_ADMIN = gql`
    query {
        getCurrentAdmin {
                    id
                    email
                    userName
        }
    }
    `;
    export const GET_CURRENT_USER = gql`
    query {
        getCurrentUser {
            id
            userName
            email
            profileImage
            unreadMessage
        }
    }
    `;
    export const GET_USER = gql`
    query ($id: Int, $type:Int, $pageNumber:Int){
        getUserDetails (id: $id, type:$type, pageNumber:$pageNumber) {
            foundUser{
                id,
                email,
                userName
                status,
                createdAt,
                updatedAt,
                userRating,
                profileImage,
                password,
                isBlocked,
                blocked,
                googleVerified,
                userRating,
                location{
                    city
                }
              }
              ForSale{
                id
                title
                description
                images
                isFree
                featured
                 }
            SoldOut{
            id
            title
            description
            images
            isFree
            featured
            }

            favourites{
            id
            title
            description
            images
            isFree
            featured
            }
            review{
                id
                userFrom
                imageUrl
                fromName
                userTo
                toName
                ratings
                comment
                feedBack
                updatedAt
                createdAt
                timeAgo
            }
        }
    }
    `;

    export const GET_ADMIN_USER = gql`
    query getAdminUser($id: Int) {
        getAdminUser(id: $id) {
                id,
                email,
                userName,
                status,
                role
        }
    }
    `;

export const GET_ADMIN_CATEGORIES = gql`
    query{ 
        getAdminCategoryDetails{
            id
            language{
            langCode
            name
            description
            }
            image    
            isFeatured    
            status        
            fields{
            filterId
            name
            values{
                valueParentId
                valueParent
                valueChild{
                    valueChildId
                    valueChildData
                }
            }
            min
            max
            inputTag
            isMandatory
            }  
            allIsMandatory
            allFilterId    
            createdAt
            updatedAt  
        }
    }
    `;

export const GET_FILTERS = gql`
    query{ 
      getFilters{
            id    
            name
            values{
                valueParent
                valueChild
            }
            inputTag
            min
            max  
        }
    }`;



export const GET_LANGUAGES = gql`
    query getLanguages{
        getLanguages{
            id
            name
            value
            status
            updatedAt
            createdAt
        }
       
  }
`;

export const GET_META_TAG = gql`
query getMetatags {
    getMetatags{
        id
        pageTitle
        metaDescription
        keywords
        pageUrl
        updatedAt
        createdAt
    }
  }
`;


export const GET_STATIC_PAGE = gql`
query getstaticPageDetails {
    getstaticPageDetails{
          id
          title
          content
          url
          status
          updatedAt
          createdAt
    }
  }
`;


export const GET_ADMIN_METAS = gql`
query getAdminMetatags {
    getAdminMetatags{
        id
        language{
          langCode
          pageTitle
          metaDescription
          keywords
        }
        pageUrl
        updatedAt
        createdAt
    }
  }
`;

// export const CHATLIST_SUBSCRIPTION = gql`
//   subscription newrosterAdded($type:String!){
//     newrosterAdded(type:$type){
//         userId
//         groupId
//         groupName
//         isBlocked
//         blockedBy
//         userName
//         profileImage
//         role
//         productName
//         sellingStatus
//         image
//         productId
//         currencyCode
//         currencySymbol
//         rate
//         lastseen
//         deleteChat
//     }
// }
// `;
export const ADD_METATAGS = gql`
mutation updateMetatags($id: Int,$data: metatagsInfo) {
    updateMetatags(id:$id, data: $data){
       id,
       language{
        pageTitle
        metaDescription
           langCode
           keywords
       }
       pageUrl
       updatedAt
       createdAt
}
}
`;


export const GET_ADMIN_LANGUAGES = gql`
    query getAdminLanguages{
        getAdminLanguages{
            id
            name
            value
            status
            updatedAt
            createdAt
        }
       
  }
`;

export const UPDATE_LANGUAGE = gql`
    mutation updateLanguage($id: Int, $data: languageInfo){
        updateLanguage(id: $id, data: $data){
        	id
            name
            value
            status
            updatedAt
            createdAt
        }
    }`;

export const GET_STATIC_PAGES = gql`
    query getAdminStaticPageDetails{
        getAdminStaticPageDetails{
        id
        language{
        langCode
        title
        content
        }
        url
        status
        updatedAt
        createdAt
    }
    }
`;

export const UPDATE_STATIC_PAGES = gql`
mutation updateStaticPages($id: Int, $data: staticPagesInfo){
    updateStaticPages(id: $id, data: $data){
        id
        language{
            langCode
            title
            content
        }
        url
        status
        updatedAt
        createdAt
    }
}`;

export const GET_CATEGORIES = gql`
    query getCategoryDetails($fetch: String) {
        getCategoryDetails(fetch: $fetch) {
            category{
                id
                name
                description
                image
                createdAt
                updatedAt
                status
                isFeatured
                fields{
                filterId
                name
                values{
                    valueParentId
                    valueParent
                    valueChild{
                        valueChildId
                        valueChildData
                    }
                }
                    min
                    max
                    inputTag
                    isMandatory
                } 
                }
            frequency
            currencyCode
            currencySymbol
            unreadMessage
            adBannerDetails{
                id
                name
                webBannerImage
                mobileBannerImage
                bannerUrl
                status
                updatedAt
                createdAt
            }
        }
    }
    `;

    export const GET_SITE_INFO = gql`
    query {
        getSiteInfo {
            name,
            version,
            defaultCurrency,
            defaultUnit,
            contactNo,
            image,
            favicon,
            footerLogo,
            footerBatch,
            loginImage,
            adminloginImage,
            footerBackground,
            utubeLink,
            twLink,
            fbLink,
            androidLink,
            iosLink,
            instagramLink,
            googleAnalyticKey,
            Environment,
            MerchantId,
            PublicKey,
            PrivateKey,
            fromAddress,
            fromName,
            uName,
            password,
            paymentApi,
            admob,
            admobBanner,
            googleApi,
            facebookAppId,
            googleAppId,
            firebaseJson,
            stripeSecretKey,
            stripePublishKey,
            paypalEnvironment,
            paypalAppId,
            braintree,
            stripe,
            paypal,
            appleClientId,
            appleTeamId,
            appleKeyIdentifier,
            appleP8File
        }
    }
    `;

    export const GET_CURRENCIES = gql`
    query getCurrencies($fetch: String) {
        getCurrencies(fetch:$fetch) {
            symbol,
            code,
            name,
            rate,
            id,
            status,
            default,
            createdAt,
            updatedAt
        }
      }
    `;

    export const GET_CURRENCY = gql`
    query getCurrency ($id: Int) {
        getCurrency (id: $id){
            symbol,
            code,
            name,
            rate,
            id,
            status
        }
      }
    `;

    export const UPDATE_SITE = gql`
    mutation($data: SiteInput) {
        updateSiteInfo(data: $data)
    }
    `;
    export const UPDATE_REASON = gql`
    mutation($id: Int $data: Reason) {
        updateReason(id: $id, data: $data)
    }
    `;
    export const UPDATE_REVIEW = gql`   
    mutation updateReview($id:Int,$data:Review){
        updateReview(id:$id,data:$data)
    }
    `;
    export const GET_REASON = gql`
    query getReason ($reasonId: Int) {
        getReason (reasonId: $reasonId) {
            id
            name
            description
            image
            status
        }
    }`;


    export const GET_REASONS = gql`
    query {
        getReasons {
            id
            name
            description
            image
            status
            createdAt
        }
    }`;

export const GET_ADMIN_REASONS = gql`
        query {
            getAdminReasons{
            id
            language{
            langCode
            name
            description
            }
            image
            status
            updatedAt
            createdAt
            }
        }`;

    export const UPDATE_USER_REPORT = gql`
        mutation($id: Int, $reportId: Int, $comments: String) {
            updateUserReports(id: $id, reportId:$reportId, comments:$comments)
        }
        `;
    export const ADD_CATEGORY = gql`
    mutation($id: Int $data: CategoryInfo) {
        updateCategory(id: $id data: $data)
      }
    `;

    export const UPDATE_CURRENCY = gql`
    mutation($id: Int, $data: CurrencyInfo) {
        updateCurrency(id: $id, data: $data)
    }
    `;

    export const BLOCK_USER = gql`
    mutation blockUser($id: Int) {
        blockUser(id: $id) {
            status
            groupIds
            groupNames
        }
    }
    `;

    export const DELETE = gql`
    mutation($id: Int! $typeConfig: String!) {
        delete(id: $id typeConfig: $typeConfig)
      }
    `;
  export const USER_PRODUCT_DELETE = gql`
    mutation deleteProduct($id:Int!){
        deleteProduct(id:$id){
        result
        }
    }
    `;


    export const GET_REVIEWS = gql`
    query {
        getReviews {    
            id
            fromName,
            toName,
            ratings,
            comment,
            feedBack,
            updatedAt,
            createdAt
        }
    }
    `;

    export const GET_REVIEW = gql`
        query getReview($userId: Int) {
             getReview(userId: $userId) {
                foundReview {
                    id
                    userFrom
                    imageUrl
                    fromName
                    userTo
                    toName
                    ratings
                    comment
                    feedBack
                    updatedAt
                    createdAt
                    timeAgo
                }
                feedBack {
                    primaryLevel
                    secondaryLevel
                }
            }
        }`;

    export const GET_FEEDBACKS = gql`
    query{
        getFeedBacks{
            id,
            name,
            description,
            feedbackType,
            status,
            updatedAt,
            createdAt
        }
    }
    `;
 export const GET_FEATURELIST_DETAILS = gql`
 query{
     getFeaturedDetails{
         featuredInfo{
             id,
             name,
             image,
             description,
             price,
             currencyCode,
             status,
             validationPeriod,
             updatedAt,
             createdAt,
             currencySymbol,
             beforeconversionMsg,
             afterconversionMsg
         },
         paymentInfo{
             payment_type,
             value,
             icon,
             key,
             mode
         }
      
     }
 }
 `;

    export const GET_ADMIN_FEATURELIST_DETAILS = gql`
    query{
        getAdminFeaturedDetails{
            id,
            image,
            language{
                name,
                description,
                langCode
            }
            price,
            currencyCode,
            status,
            validationPeriod,
            updatedAt,
            createdAt,
            currencySymbol
        }
    }
    `;

    export const ADD_FEATURELIST = gql`
     mutation updateFeatured($id: Int,$data: featuredInfo) {
        updateFeatured(id:$id, data: $data){
            id,
            language{
                name,
                description,
                langCode
            }
            image
            price,
            currencyCode,
            status,
            validationPeriod,
            updatedAt,
            createdAt
   }
}
`;
    export const GET_FEEDBACK = gql`
    
        query getFeedBack($id: Int) {
            getFeedBack(id: $id) {
                    id,
                    name,
                    description,
                    feedbackType,
                    status
            }
        }
    `;
    export const GET_BLOCKED = gql`
    query {
        getBlocked {
            id
            fromName
            toName
        }
    }`;

    export const GET_CONTACT_DETAILS = gql`
    query {
        getAllContactUs {
            name
            email
            feedback
        }
    }`;


    export const GET_REPORTED_USERS = gql`
    query {
        getUserReports {
            id,
            fromName,
            toName,
            reportName,
            comments
        }
    }`;

    export const GET_REPORTED_PRODUCTS = gql`
    query {
        getReportedProducts {
            id
            user
            productId
            productName
            productUser
            comments
        }
    }`;

export const GET_ROOMS = gql`
query{
  getRooms{
    id
    userId
    productId
  }
}`;

export const GET_ROOM_BY_ID = gql`
     query getRoomById($id: String!) {
        getRoomById(id: $id) {
              userId
            }
    }`;

export const GET_MESSAGES = gql`
	query getMessages($id:Int!){
        getMessages(id:$id){  
            productId
            productuserId
            productuserName
            title
            rate    
            sellingStatus
            productuserImage
            isFree
            isBlocked
            blockedBy
            message{
            id
            message
            createdAt
            userId
            profileImage
            readMessage
            groupId
            }
        } 
}
`;
export const GET_TRANSACTIONS_DETAILS = gql`
   query{
    getTransactionDetails{
        id
        status
        amount
        transactionId
        success
        currencyIsoCode
        paymentInstrumentType
        cardType
        maskedNumber
        cardholderName    
        createdAt
        updatedAt
        productName
        productuserName
        currencySymbol
        paymentMethod
   }
}`;

export const GET_ADMIN_FILTER = gql`
   query{
        getAdminFilter {
            id
            language{
                langCode
                name
            values{
                valueParent
                valueChild
              }
            }
            min
            max
            inputTag
            status
            updatedAt
            createdAt
            }
   }`;

export const GET_BANNER_INFO = gql`
   query{
    getAdBannerInfo{
       id
       name
       status
       updatedAt
       createdAt
       bannerUrl
       webBannerImage
       mobileBannerImage
   }
}`;

export const UPDATE_BANNER_INFO = gql`
mutation updateAdBanner($id:Int,$data:adBannerInput){
    updateAdBanner(id:$id,data:$data){
      id
      name
      status
      updatedAt
      createdAt
      bannerUrl
      webBannerImage
      mobileBannerImage
    }
    
  }`;

export const GET_MESSAGE_BY_ID = gql`
   query getMessageById($id: Int!) {
       getMessageById(id:$id){
           text
   }
   }`;

export const SUBSCRIPTIONS = gql`
  subscription messageAdded($chatroomId:Int!){
  messageAdded(chatroomId:$chatroomId){
    message
    id
    createdAt
    userId
    profileImage
    readMessage
    groupId
    }
}
`;


export const CREATE_ROOM = gql`
mutation createRoom($userId:Int!,$productId:Int!,$productuserId:Int!){
  createRoom(userId:$userId,productId:$productId,productuserId:$productuserId){
    userId
    productId
    groupName
    productuserId
    id
    imageUrl
    profileUrl
    sellingStatus
    currencyCode
    currencySymbol
    rate
  }
}`;

export const UPDATE_FILTER = gql`
    mutation updateFilter($id:Int,$data:filterInput){
        updateFilter(id:$id, data:$data){
           id
           language{
               langCode
               name
               values{
                   valueParent
                   valueChild{
                       valueChildData
                   }
               }
            }
               max
               min
               inputTag
               status
               updatedAt
               createdAt
    }
}
`;

export const SEND_MESSAGE = gql`
    mutation sendMessage($message:String!,$room:Int!){
        sendMessage(message:$message,room:$room){
            id
            message
            profileImage
            userId
            createdAt
            readMessage
            groupId
        }
    }
`;

export const GET_PAYMENT_TOKEN = gql`
    mutation createClientToken{
        createClientToken{
            clientToken
        }
    }
`;

export const GET_STRIPE_SECRET = gql`
    mutation createStripeClientToken($data: tokenInput){
        createStripeClientToken(data: $data){
            clientSecret
        }
    }
`;
export const UPDATE_PAYMENT = gql`
    mutation ChargePaymentMethod($data: ChargePaymentMethodInput) {
        ChargePaymentMethod(data: $data) {
            success
            transaction{
                id
                status
                amount
                currencyIsoCode
                paymentInstrumentType
            creditCard{
                cardType
                maskedNumber
                cardholderName
                }      
                createdAt
                updatedAt
            }
       }
    }
`;


export const UPDATE_STRIPE_PAYMENT = gql`
mutation stripePayment($data: stripeInput) {
    stripePayment(data: $data) {
            success
            transaction{
                id
                status
                amount
                currencyIsoCode
                paymentInstrumentType
            creditCard{
                cardType
                maskedNumber
                cardholderName
                }      
                createdAt
                updatedAt
            }
   }
}
`;

export const UPDATE_PAYPAL_PAYMENT = gql`
mutation paypalPayment($data: paypalInput) {
    paypalPayment(data: $data){
        success
            transaction{
                id
                status
                amount
                currencyIsoCode
                paymentInstrumentType
            creditCard{
                cardType
                maskedNumber
                cardholderName
                }      
                createdAt
                updatedAt
            }
    }
}
`;

    // client mutations and queries
    export const GET_TOGGLE_STATUS  = gql`
    query {
        toggleStatus @client
        message @client
    }`;

    export const GET_LOGIN_POPUP_STATE  = gql`
    query  {
            isOpen @client
    }`;

    export const GET_REDIRECT_STATE  = gql`
        query  {
            pageCount @client
        }`;

    export const GET_REDIRECTFILTER_STATE  = gql`
        query  {
            pageCountFilter @client
        }`;

    export const GET_CACHE_STATE = gql`
    query {
        inActive @client
    }`;

    export const GET_OPEN_STATE = gql`
    query {
        open @client
    }`;

    export const GET_CATEGORY_ID = gql`
    query{
        categoryId @client
    }`;

    export const GET_RADIUS = gql`
    query{                
        radius @client
        } 
    `;

    export const GET_RESET_BUTTON = gql`
    query {                
    resetButton @client
    } 
    `;

    export const GET_LOCATION_NAME = gql`
    query{                
            locationName @client
        } 
    `;

    export const GET_PRODUCT_ID = gql`
    query{
        productId @client
    }`;
 export const IS_MODEL_CLOSE = gql`
    query{
        closeModel @client
    }`;
     export const IS_CATEGORY_REFETCH = gql`
     query{
        categoryRefetch @client
     }`;
    export const GET_SEARCH_INPUT =gql`
    query{
        searchInput @client
    }
    `;
    export const GET_CHATNOW_STATUS =gql`
    query{
        chatNow @client
    }
    `;
    
    export const GET_LOCATION = gql`
    query{                
        lat_lon @client
        } 
    `;
    export const GET_PRICE_DETAILS = gql`
        query{              
                min @client
                max @client
        }     
    `;

    export const GET_SORTBY_DETAILS = gql`
        query{
          sort @client
        }     
        `;

    export const GET_DATEBY_DETAILS = gql`
        query{
          sortDate @client
        }     
    `;
    export const GET_ROSTER_GROUPID_DETAILS = gql`
        query{
                rosterGroupId @client
            }     
            `;

    export const POPUP_STATE_UPDATE  = gql`
    mutation updateLoginPopupState($isOpen: Boolean) {
        updateLoginPopupState(isOpen: $isOpen) @client
    }`;

    export const UPDATE_CHATNOW_STATUS  = gql`
    mutation updateChatNowStatus($chatNow: Boolean) {
    updateChatNowStatus(chatNow:$chatNow) @client
    }`;

    export const REDIRECT_HOME  = gql`
    mutation redirectHome($pageCount: Boolean) {
        redirectHome(pageCount: $pageCount) @client
    }`;

    export const REDIRECT_HOME_FILTER  = gql`
    mutation redirectHomeFilter($pageCountFilter: Boolean) {
        redirectHomeFilter(pageCountFilter: $pageCountFilter) @client
    }`;

    export const UPDATE_TOGGLE_STATUS  = gql`
    mutation toggle($toggleStatus: Boolean, $message: String) {
        toggle(toggleStatus: $toggleStatus, message: $message) @client
    }`;
    export const INACTIVE = gql`
    mutation inActiveScreen ($inActive: Boolean) {
        inActiveScreen (inActive: $inActive) @client
    }
    `;
    export const CATEGORY_ID = gql`
    mutation getCategoryId($categoryId: Int) {
        getCategoryId(categoryId: $categoryId) @client
    }
    `;

    export const RADIUS =gql`
    mutation getRadius($radius: String){
        getRadius(radius:$radius) @client
    }
    `;
    export const UPDATE_RESET_BUTTON  = gql`
    mutation updateResetButton($resetButton: Boolean) {
        updateResetButton(resetButton: $resetButton) @client
    }`;

    export const LOCATION_NAME =gql`
    mutation getLocationName($locationName: locationName){
        getLocationName(locationName:$locationName) @client
    }
    `;

  export const PRODUCT_ID = gql`
    mutation getProductId($productId: Int) {
        getProductId(productId:$productId) @client
  }
  `;
  export const CLOSE_MODEL = gql`
    mutation isModelClose($closeModel: Boolean) {
        isModelClose(closeModel:$closeModel) @client
    }
    `;
    export const CATE_LANG_REFETCH = gql`
    mutation getRefetch($categoryRefetch: Boolean) {
        getRefetch(categoryRefetch:$categoryRefetch) @client
    }
    `;
    export const SEARCH_INPUT = gql`
     mutation searchResult($searchInput: String){
        searchResult(searchInput:$searchInput) @client
    }
    `;

    export const LOCATION =gql`
    mutation getLocation($lat_lon: lat_lon){
        getLocation(lat_lon:$lat_lon) @client
    }
    `;

    export const PRICE = gql`
    mutation getPrice($min: String ,$max: String){
        getPrice(min :$min , max:$max)@client
    }
    `;
    export const SORTBY = gql`
    mutation getSortBy($sort: Int){
      getSortBy(sort:$sort)@client
    }
    `;
    export const DATEBY = gql`
     mutation getDateBy($sortDate: Int){
        getDateBy(sortDate : $sortDate)@client
     }
     `;
    export const ISOPEN = gql`
    mutation isOpen ($open: Boolean) {
        isOpen (open: $open) @client
    }
    `;

export const ROSTER_GROUPID = gql`
mutation getRosterGroupId($rosterGroupId: Int){
    getRosterGroupId(rosterGroupId:$rosterGroupId)@client
}
`;
    export const SIGNIN = gql`
    mutation signin($email: String!, $password: String!) {
        signin(email: $email, password: $password) {
            result {
                userId
                userName
                profileImage
                status
                location {
                    lat_lon
                    state
                    country
                    pincode
                    city
                }
                currencyCode
                currencySymbol
            }
            noEmail
        }
    }`;

    export const SIGNUP = gql`
    mutation signup($data: SignupInput) {
        signup(data: $data) {
            result {
                userId
                token
                userName
                profileImage
                status
                location {
                    lat_lon
                    state
                    country
                    pincode
                    city
                }
                currencyCode
                currencySymbol
            }
            noEmail
        }
    }`;

    export const SOCIAL_LOGIN = gql`
       mutation socialLogin($data: SocialLogin) {
        socialLogin(data: $data) {
            result {
                userId
                userName
                profileImage
                status
                location {
                    lat_lon
                    state
                    country
                    pincode
                    city
                }
                currencyCode
                currencySymbol
            }
            noEmail
        }
}
    `;


    

