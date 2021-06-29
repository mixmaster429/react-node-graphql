
const {categorySeed} = require("./category");
const {timezoneSeed} = require("./timezone");
const {currencySeed} = require("./currency");
const {countrySeed} = require("./country");
const {reportSeed} = require("./report");
const {reviewSeed} = require("./review");
const {blockSeed} = require("./block");
const {uReportSeed} = require("./uReport");
const {pReportSeed} = require("./pReport"); 
const {notificationSeed} = require("./notification");
const {feedBackSeed} = require("./feedback");
const {mailtempSeed} = require("./mailtemp");
const {deletechatSeed} = require("./deleteChat");
const {featuredSeed} = require("./featured");
const {adBannerSeed} = require("./adBanner");
const {staticPagesSeed} = require("./staticPages");
const {metatagsSeed} = require("./metatags");
const {filterSeed} = require("./filterCategory");


const {Admin_User, Admin_Email, Admin_Password, Site_Name} = process.env;

const languageSeed = [
    // {
    //     _id: 10000,      
    //     name: "Bahasa Indonesia",
    //     value: "id",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10001,      
    //     name: "Bahasa Melayu",
    //     value: "ms",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10002,      
    //     name: "Català",
    //     value: "ca",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10003,      
    //     name: "Dansk",
    //     value: "da",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10004,      
    //     name: "Deutsch",
    //     value: "de",
    //     status: "Active",
    //     default_language: 0
    // },
    {
        _id: 10005,      
        name: "English",
        value: "en",
        status: "Active"       
    },
    // {
    //     _id: 10006,      
    //     name: "Español",
    //     value: "es",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10007,      
    //     name: "Eλληνικά",
    //     value: "el",
    //     status: "Active",
    //     default_language: 0
    // },
    {
        _id: 10008,      
        name: "Français",
        value: "fr",
        status: "Active"
    },
    // {
    //     _id: 10009,      
    //     name: "Italiano",
    //     value: "it",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10010,      
    //     name: "Magyar",
    //     value: "hu",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10011,      
    //     name: "Nederlands",
    //     value: "nl",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10012,      
    //     name: "Norsk",
    //     value: "n0",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10013,      
    //     name: "Polski",
    //     value: "pl",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10014,      
    //     name: "Português",
    //     value: "pt",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10015,      
    //     name: "Suomi",
    //     value: "fi",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10016,      
    //     name: "Svenska",
    //     value: "sv",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10017,      
    //     name: "Türkçe",
    //     value: "tr",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10018,      
    //     name: "Íslenska",
    //     value: "is",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10019,      
    //     name: "Čeština",
    //     value: "cs",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10020,      
    //     name: "Русский",
    //     value: "ru",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10021,      
    //     name: "ภาษาไทย",
    //     value: "th",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10022,      
    //     name: "中文 (简体)",
    //     value: "zh",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10023,      
    //     name: "中文 (繁體)",
    //     value: "zh-TW",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10024,      
    //     name: "日本語",
    //     value: "ja",
    //     status: "Active",
    //     default_language: 0
    // },
    // {
    //     _id: 10025,      
    //     name: "한국어",
    //     value: "ko",
    //     status: "Active",
    //     default_language: 0
    // },
    {
        _id: 10026,      
        name: "العربية",
        value: "ar",
        status: "Active"
    },
]; 

const userSeed = [
    {
        _id: 10000,
        email: "john@gmail.com",
        userName: "John", password: "1234",
        favourites: [10000, 10010, 10011, 10015],
        profileImage: "admin.jpg",
        location: {"city":"Kings County",
        "state":"New York",
        "pincode":"625002",
        "country":"United States",
        "lat_lon":[-73.95667750000001,40.7221969]},
        unit: "KM",
        bio: "test1"
    },
    {
        _id: 10001, 
        email: "trioanglepassup@gmail.com",
        userName: "Tony",
        password: "passup",
        favourites: [10011, 10018],
        profileImage: "marc.jpg",
        location: {
            "city":"New York",
            "state":"New York",
            "pincode":625002,
            "country":"United States",
            "lat_lon":[-74.0059728,40.7127753]
        },
        unit: "MI",
        bio: "sample"
    },
    {
        _id: 10002,
        email: "mike@gmail.com",
        userName: "Mike",
        password: "1234",
        favourites: [10000, 10015, 10018],
        profileImage: "avatar.jpg",
        location: {
            "city":"West New York",
            "state":"New Jersey",
            "pincode":"07093",
            "country":"United States",
            "lat_lon":[-74.01430640000001,40.7878788]
        },
        unit: "KM",
        bio: "test2"
    }
];

const adminSeed = [

    {_id: 10000, email: "admin@gmail.com", userName: "admin", password: "passup", role: "SuperAdmin"}
    // {_id: 10001, email: "android@trioangle.com", userName: "android", password: "1234"},
    // {_id: 10002, email: "passup@gmail.com", userName: "passup", password: "1234"}
];

const siteSeed = [
    {
        _id: 1,
        name: Site_Name,
        contactNo: "1800-00-2568",
        version: "1.0",
        defaultCurrency: "USD",
        image: "logo.png",
        favicon: "favicon.png",
        footerLogo: "footerLogo.png",
        footerBatch: "footerBatch.png",
        loginImage: "loginImage.png",
        adminloginImage:"adminloginImage.jpg",
        footerBackground: "footerBackground.png",          
        fbLink: "https://www.facebook.com/Trioangle.Technologies/",
        twLink: "https://twitter.com/trioangle",
        utubeLink: "https://www.youtube.com/channel/UC2EWcEd5dpvGmBh-H4TQ0wg",
        androidLink: "https://play.google.com/store/apps/details?id=com.trioangle.passup",
        iosLink: "https://play.google.com/store/apps/details?id=com.trioangle.passup",
        instagramLink: "https://www.instagram.com/trioangletechnologies/" ,
        fromAddress: "android@trioangle.com",
        fromName: "Passup",
        uName: "android@trioangle.com",
        password: "xnwhhbvujrqixcdj",
        paymentApi: "Nexmo",
        admob: "admob",
        admobBanner: "admobBanner",
        googleApi: "AIzaSyDY7VsBNsygBSdtZ6GJFUrmyIinvCsJTIY",
        facebookAppId:"406856446609936",
        googleAppId:"447163808022-gdjaaeji7o827g3i7b5g3omf1pe4kekb.apps.googleusercontent.com",
        googleAnalyticKey:"ABCDEFGH12345678",
        Environment: "Sandbox",
        MerchantId: "5vjrvg65b395vm9c",
        PublicKey: "yf6q8yzjb97c3rkd",
        PrivateKey: "c2f449d9eaeeda10796d03f6fc04c9cf",
        firebaseJson: "firebaseFile.json",
        stripeSecretKey: "sk_test_oDQJIjjX9Dj4AFAaoWEflW7b00e1TKmkJO",
        stripePublishKey: "pk_test_adMXeCIzhrzM4q8HTMKytWLn007sPiPxfm",
        paypalAppId: "access_token$sandbox$yp8z9k5tfmbmxr55$fd34f0dfdc883ee78c3700a533a41361",
        paypalEnvironment: "sandbox",
        appleClientId: "com.trioangle.passup.service.demo",
        appleTeamId:"W89HL6566S",
        appleKeyIdentifier:"7XTD5STH2W",
        appleP8File:"AuthKey_7XTD5STH2W.p8"
    }
];

const contactUsSeed = [
    {
        _id: 10000,
        name: "trioangle",
        email: "trioangle@gmail.com",
        feedback: "Good"
    }
];

const productSeed = [
    {
        "_id" : 10000,
        "images" : [ 
            "car.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f55e108693b511a8a7b8d4a",
                "title" : "Modified BMW ",
                "description" : "Magnetic Metallic 2016 Modified BMW EcoBoost RWD 6-Speed EcoBoost 2.3L I4 GTDi DOHC Turbocharged VCT ABS brakes, Compass, Electronic Stability Control, Illuminated entry, Low tire pressure warning, Remote keyless entry, Traction control.\nRecent Arrival!"
            }
        ],
        "categoryId" : 10000,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0059728, 
                40.7127753
            ]
        },
        "isFree" : false,
        "userId" : 10001,
        "rate" : 17000,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "_id" : "5f55e108693b511a8a7b8d49",
                "fieldId" : "7",
                "fieldChild" : "5f521ad68bacd50d931538f5"
            }, 
            {
                "_id" : "5f55e108693b511a8a7b8d48",
                "fieldId" : "9",
                "rangeValue" : 54255
            }, 
            {
                "_id" : "5f55e108693b511a8a7b8d47",
                "fieldId" : "10",
                "fieldParent" : "BMW",
                "fieldChild" : "5f52234e8bacd50d93153930"
            }
        ],
        // "createdAt" : "2020-09-07T07:28:08.373Z",
        // "updatedAt" : "2020-09-07T07:28:08.373Z"
    },
    {
        "_id" : 10001,
        "images" : [ 
            "real.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f55e261693b511a8a7b8d54",
                "title" : "Private Villa with Surveillance  ",
                "description" : "This 2 bedroom property is a mid-terrace townhome situated within a luxury 5* star premier resort community, Balmoral at Waters Edge. Covering a total of 2139 sq ft the property features two bathrooms, a large open plan living area and kitchen as well as a private courtyard. This new luxury resort is surrounded by lush landscaping within a 113 acre private gated community. Balmorals long list of facilities and amenities include an exclusive clubhouse with games room, resort pool with poolside bar, expansive water park and a multitude of perfectly manicured parks and gardens."
            }
        ],
        "categoryId" : 10001,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0059728, 
                40.7127753
            ]
        },
        "isFree" : false,
        "userId" : 10001,
        "rate" : 199000,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "_id" : "5f55e261693b511a8a7b8d53",
                "fieldId" : "5",
                "fieldChild" : "5f5219aa8bacd50d931538e6"
            }, 
            {
                "_id" : "5f55e261693b511a8a7b8d52",
                "fieldId" : "6",
                "rangeValue" : 35270
            }, 
            {
                "_id" : "5f55e261693b511a8a7b8d51",
                "fieldId" : "7",
                "fieldChild" : "5f521ad68bacd50d931538f5"
            }, 
            {
                "_id" : "5f55e261693b511a8a7b8d50",
                "fieldId" : "8",
                "fieldParent" : "Residential Land",
                "fieldChild" : "5f521db78bacd50d9315390f"
            }
        ],
        // "createdAt" : "2020-09-07T07:33:53.908Z",
        // "updatedAt" : "2020-09-07T07:33:53.908Z"
    },
    {
        "_id" : 10002,
        "images" : [ 
            "massage.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f55e384693b511a8a7b8d5e",
                "title" : "HERBAL & NATURAL HEAD MASSAGE",
                "description" : "If you feel tired and stressed after a working day, we are happy to give you an enjoyable and healthy solution to find your balance again."
            }
        ],
        "categoryId" : 10002,
        "location" : {
            "city" : "New Rochelle",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -73.7823549, 
                40.9114882
            ]
        },
        "isFree" : false,
        "userId" : 10000,
        "rate" : 250,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "_id" : "5f55e384693b511a8a7b8d5d",
                "fieldId" : "11",
                "fieldChild" : "5f5224428bacd50d9315393e"
            }, 
            {
                "_id" : "5f55e384693b511a8a7b8d5c",
                "fieldId" : "12",
                "rangeValue" : 65
            }, 
            {
                "_id" : "5f55e384693b511a8a7b8d5b",
                "fieldId" : "13",
                "fieldParent" : "Swedish massage",
                "fieldChild" : "5f5235a88bacd50d9315395e"
            }, 
            {
                "_id" : "5f55e384693b511a8a7b8d5a",
                "fieldId" : "15",
                "fieldChild" : "5f55dc29693b511a8a7b8d37"
            }
        ],
        // "createdAt" : "2020-09-07T07:38:44.802Z",
        // "updatedAt" : "2020-09-07T07:38:44.802Z"
    },
    {
        "_id" : 10003,
        "images" : [ 
            "job.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f55e479693b511a8a7b8d6a",
                "title" : "Senior Systems Engineer",
                "description" : "Education: A minimum of BS in Computer Science or similar degree, or the equivalent in technical certifications.\n\nYears of experience: A minimum of 8 years of on site and remote Server, Desktop and Network technical support experience required\n\nIndustry related experience highly desired: MSP & experience in implementing Managed Service Solutions to end elients is preferred\n\nPreferred Certifications:\nA+, NET+ , Security+ , Microsoft Certified Professional (MCP), Microsoft Certified Systems Engineer (MCSE), Cisco Certified Network Administrator (CCNA), Cisco Certified Network Professional (CCNP)"
            }
        ],
        "categoryId" : 10003,
        "location" : {
            "city" : "Division No. 18",
            "state" : "Saskatchewan",
            "country" : "Canada",
            "lat_lon" : [ 
                -106.346771, 
                56.130366
            ],
            "pincode" : "S0J 2B0"
        },
        "isFree" : false,
        "userId" : 10002,
        "rate" : 12000,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "_id" : "5f55e479693b511a8a7b8d69",
                "fieldId" : "2",
                "fieldChild" : "5f52109e8bacd50d931538a3"
            }, 
            {
                "_id" : "5f55e479693b511a8a7b8d68",
                "fieldId" : "3",
                "rangeValue" : 2018
            }, 
            {
                "_id" : "5f55e479693b511a8a7b8d67",
                "fieldId" : "4",
                "fieldChild" : "5f5219388bacd50d931538da"
            }, 
            {
                "_id" : "5f55e479693b511a8a7b8d66",
                "fieldId" : "11",
                "fieldChild" : "5f5224428bacd50d9315393f"
            }, 
            {
                "_id" : "5f55e479693b511a8a7b8d65",
                "fieldId" : "14",
                "fieldParent" : "BE",
                "fieldChild" : "5f55d714693b511a8a7b8d0e"
            }
        ],
        // "createdAt" : "2020-09-07T07:42:49.130Z",
        // "updatedAt" : "2020-09-07T07:42:49.130Z"
    },
    {
        "_id" : 10004,
        "images" : [ 
            "Projector.png"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f608d23421eb14e0e205bb1",
                "title" : "Projector",
                "description" : "HD Movie projector"
            }
        ],
        "categoryId" : 10004,
        "location" : {
            "city" : "Division No. 18",
            "state" : "Saskatchewan",
            "country" : "Canada",
            "lat_lon" : [ 
                -106.346771, 
                56.130366
            ],
            "pincode" : "S0J 2B0"
        },
        "isFree" : false,
        "userId" : 10002,
        "rate" : 16,
        "currencyCode" : "USD",
        "categoryFields" : [],
        // "createdAt" : "2020-09-15T09:45:07.671Z",
        // "updatedAt" : "2020-09-15T09:45:07.671Z",
    },
    {
        "_id" : 10005,
        "images" : [ 
            "football.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f608d8e421eb14e0e205bb3",
                "title" : "Football",
                "description" : "Football"
            }
        ],
        "categoryId" : 10005,
        "location" : {
            "city" : "Cape May County",
            "state" : "New Jersey",
            "country" : "United States",
            "lat_lon" : [ 
                -74.8239119, 
                39.0736713
            ],
            "address" : "New Jersey 444"
        },
        "isFree" : false,
        "userId" : 10000,
        "rate" : 4,
        "currencyCode" : "USD",
        "categoryFields" : [],
        // "createdAt" : "2020-09-15T09:46:54.146Z",
        // "updatedAt" : "2020-09-15T09:46:54.146Z"
    },
    {
        "_id" : 10006,
        "images" : [ 
            "Velvetsofa.png"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f608e2c421eb14e0e205bb5",
                "title" : "Velvet sofa",
                "description" : "Comfortable velvet"
            }
        ],
        "categoryId" : 10006,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0059728, 
                40.7127753
            ]
        },
        "isFree" : false,
        "userId" : 10001,
        "rate" : 12,
        "currencyCode" : "USD",
        "categoryFields" : [],
        // "createdAt" : "2020-09-15T09:49:32.490Z",
        // "updatedAt" : "2020-09-15T09:49:32.490Z",
    },
    {
        "_id" : 10007,
        "images" : [ 
            "WatchesforMen.png"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f608e7b421eb14e0e205bb7",
                "title" : "Wrist Watch",
                "description" : "Stylish wrist watch for men"
            }
        ],
        "categoryId" : 10007,
        "location" : {
            "city" : "Miami",
            "state" : "Florida",
            "country" : "United States",
            "lat_lon" : [ 
                -80.1917902, 
                25.7616798
            ]
        },
        "isFree" : false,
        "userId" : 10002,
        "rate" : 7,
        "currencyCode" : "USD",
        "categoryFields" : [],
        // "createdAt" : "2020-09-15T09:50:51.685Z",
        // "updatedAt" : "2020-09-15T09:50:51.685Z",
    },
    {
        "_id" : 10008,
        "images" : [ 
            "Benz.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f55e5a5693b511a8a7b8d72",
                "title" : "Benz GLS - Class ",
                "description" : "2017 Mercedes-Benz GLS Black\nV6\n4MATIC 9-Speed Automatic"
            }
        ],
        "categoryId" : 10000,
        "location" : {
            "city" : "Division No. 18",
            "state" : "Saskatchewan",
            "country" : "Canada",
            "lat_lon" : [ 
                -106.346771, 
                56.130366
            ],
            "pincode" : "S0J 2B0"
        },
        "isFree" : false,
        "userId" : 10000,
        "rate" : 41000,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "7",
                "fieldChild" : "5f521ad68bacd50d931538f5"
            }, 
            {
                "fieldId" : "9",
                "rangeValue" : 26717
            }, 
            {
                "fieldId" : "10",
                "fieldParent" : "Benz",
                "fieldChild" : "5f52234e8bacd50d9315392c"
            }
        ],
        // "createdAt" : "2020-09-07T07:47:49.925Z",
        // "updatedAt" : "2020-09-07T07:47:49.925Z",
        "__v" : 0
    },
    {
        "_id" : 10009,
        "images" : [ 
            "realEstate.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f55e6b7693b511a8a7b8d7c",
                "title" : "Single Story House For Rent !!!",
                "description" : "Luxurious contemporary fully furnished newly built custom home in prestigious Reunion Resort. Truly one of a kind on a south facing double lot overlooking intense conservation. Ultra modern, marked with striking yet functional elegance, 12,500 SF under air and a total of 15,500 with balconies. A masterpiece of craftsmanship featuring 10 Bedrooms and 12 Bathrooms. Imposing entry and unparalleled quality throughout this magnificent professionally designed and decorated Estate. Indulge and entertain on a grand scale by the sophisticated 55 foot south facing salt water infinity edge pool surrounded by lush landscaping and unique outdoor Bar and summer kitchen. Camera security system, Wolf and Sub Zero appliances, double height ceilings, starlight decor cinema, bespoke kids rooms, games, arcade, man cave, professionally equipped gym are just some of this spectacular Property highlights."
            }
        ],
        "categoryId" : 10001,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0059728, 
                40.7127753
            ]
        },
        "isFree" : false,
        "userId" : 10001,
        "rate" : 12000,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "5",
                "fieldChild" : "5f5219aa8bacd50d931538e5"
            }, 
            {
                "fieldId" : "6",
                "rangeValue" : 5889
            }, 
            {
                "fieldId" : "7",
                "fieldChild" : "5f521ad68bacd50d931538f4"
            }, 
            {
                "fieldId" : "8",
                "fieldParent" : "Residential Land",
                "fieldChild" : "5f521db78bacd50d93153910"
            }
        ],
        // "createdAt" : "2020-09-07T07:52:23.968Z",
        // "updatedAt" : "2020-09-07T07:52:23.968Z"
    },
    {
        "_id" : 10010,
        "images" : [ 
            "MassageNew.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f55e7dc693b511a8a7b8d8b",
                "title" : "Regain Your Energy !!!",
                "description" : "Feel fresh when you get out from our place . Best place for full body massage with additional special offers "
            }
        ],
        "categoryId" : 10002,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0059728, 
                40.7127753
            ]
        },
        "isFree" : false,
        "userId" : 10001,
        "rate" : 1000,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "11",
                "fieldChild" : "5f5224428bacd50d9315393f"
            }, 
            {
                "fieldId" : "12",
                "rangeValue" : 60
            }, 
            {
                "fieldId" : "13",
                "fieldParent" : "Hot stone massage",
                "fieldChild" : "5f5235a88bacd50d9315395a"
            }, 
            {
                "fieldId" : "15",
                "fieldChild" : "5f55dc29693b511a8a7b8d36"
            }
        ],
        // "createdAt" : "2020-09-07T07:55:11.460Z",
        // "updatedAt" : "2020-09-07T07:57:16.000Z"
    },
    {
        "_id" : 10011,
        "images" : [ 
            "hire.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f55e909693b511a8a7b8d97",
                "title" : "English Literature Tutor",
                "description" : "Qualifications :\n\npassionate about teaching\nknow how to motivate students\nout-going, friendly personality\nreliable and dependable"
            }
        ],
        "categoryId" : 10003,
        "location" : {
            "city" : "Division No. 18",
            "state" : "Saskatchewan",
            "country" : "Canada",
            "lat_lon" : [ 
                -106.346771, 
                56.130366
            ],
            "pincode" : "S0J 2B0"
        },
        "isFree" : false,
        "userId" : 10000,
        "rate" : 3000,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                
                "fieldId" : "2",
                "fieldChild" : "5f52109e8bacd50d931538a2"
            }, 
            {
                "fieldId" : "3",
                "rangeValue" : 2013
            }, 
            {
                "fieldId" : "4",
                "fieldChild" : "5f5219388bacd50d931538d7"
            }, 
            {
                "fieldId" : "11",
                "fieldChild" : "5f5224428bacd50d9315393f"
            }, 
            {
                "fieldId" : "14",
                "fieldParent" : "ARTS",
                "fieldChild" : "5f55d714693b511a8a7b8d0a"
            }
        ],
        // "createdAt" :  "2020-09-07T08:02:16.989Z",
        // "updatedAt" : "2020-09-07T08:02:16.989Z",
    },
    {
        "_id" : 10012,
        "images" : [ 
            "camera.jpeg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f621d9822b786154b228aa2",
                "title" : "Nikon D5600",
                "description" : "Bring your creativity to life with the new D5600. It features 24.2 effective megapixels, an EXPEED 4 image-processing engine, and an ISO range of 100-25600 that captures beautiful and vibrant imagery, Full HD videos and time-lapse movies even in low light situations. Inspiration also comes easy when you discover new perspectives with the vari-angle LCD monitor and intuitive touch interface. With Bluetooth® and the Nikon SnapBridge app*1 for automatic transfer of images to your compatible smart devices*2, the D5600 is perfect for the connected world. "
            }
        ],
        "categoryId" : 10004,
        "location" : {
            "city" : "Cape May County",
            "state" : "New Jersey",
            "country" : "United States",
            "lat_lon" : [ 
                -74.8239119, 
                39.0736713
            ],
            "address" : "New Jersey 444"
        },
        "isFree" : false,
        "userId" : 10000,
        "rate" : 1000,
        "currencyCode" : "USD",
        "categoryFields" : [],
        // "createdAt" : "2020-09-16T13:50:16.852Z",
        // "updatedAt" : "2020-09-16T14:13:44.000Z",
    },  
    {
        "_id" : 10013,
        "images" : [ 
            "skateBoard.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f621d5c22b786154b228a9f",
                "title" : "1 Month Used Skate Board !!",
                "description" : "Wooden skate board for sale . \nPurchased at  1500 $\nOne month partially used !!\nGood condition "
            }
        ],
        "categoryId" : 10005,
        "location" : {
            "city" : "Miami",
            "state" : "Florida",
            "country" : "United States",
            "lat_lon" : [ 
                -80.1917902, 
                25.7616798
            ]
        },
        "isFree" : false,
        "userId" : 10000,
        "rate" : 750,
        "currencyCode" : "USD",
        "categoryFields" : [],
        // "createdAt" : "2020-09-16T14:05:16.451Z",
        // "updatedAt" : "2020-09-16T14:12:44.000Z",
    },
    {
        "_id" : 10014,
        "images" : [ 
            "sofa1.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f62121622b786154b228a86",
                "title" : "Luxe Sofa Brand new !!",
                "description" : "High-performance fabric :\n\nThe upholstery comes with a high rub count and is resistant to fading and pilling. Its durable properties will keep your sofa looking new for years to come."
            }
        ],
        "categoryId" : 10006,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0059728, 
                40.7127753
            ]
        },
        "isFree" : false,
        "userId" : 10001,
        "rate" : 12000,
        "currencyCode" : "USD",
        "categoryFields" : [],
        // "createdAt" : ISODate("2020-09-16T13:24:38.467Z"),
        // "updatedAt" : ISODate("2020-09-16T13:24:38.467Z"),
    }, 
    {
        "_id" : 10015,
        "images" : [ 
            "hoodies.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f621b2022b786154b228a95",
                "title" : "White Hoodies ! Brand New!!",
                "description" : "Brand New Hoodies for sale !!\nMake your own style !!\nCustomised hoodies available at low price !!"
            }
        ],
        "categoryId" : 10007,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0012863, 
                40.7189569
            ],
            "address" : "Canal Street"
        },
        "isFree" : false,
        "userId" : 10002,
        "rate" : 15,
        "currencyCode" : "USD",
        "categoryFields" : [],
        // "createdAt" : "2020-09-16T14:03:12.295Z",
        // "updatedAt" : "2020-09-16T14:03:12.295Z",
    }, 
    {
        "_id" : 10016,
        "images" : [ 
            "modCar.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f563205693b511a8a7b8d9f",
                "title" : "Modified Super car !!",
                "description" : "Acceleration 3.2s 0-60 mph.\nRange 299 miles.\nDrive Dual Motor All-Wheel Drive.\nSeating 5 Adults.\nWheels 20\""
            }
        ],
        "categoryId" : 10000,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0059728, 
                40.7127753
            ]
        },
        "isFree" : false,
        "userId" : 10002,
        "rate" : 150000,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "7",
                "fieldChild" : "5f521ad68bacd50d931538f5"
            }, 
            {
                "fieldId" : "9",
                "rangeValue" : 3731
            }, 
            {
                "fieldId" : "10",
                "fieldParent" : "Tesla",
                "fieldChild" : "5f52234e8bacd50d9315392a"
            }
        ],
        // "createdAt" : "2020-09-07T13:13:41.113Z",
        // "updatedAt" : "2020-09-07T13:13:41.113Z",
    },
    {
        "_id" : 10017,
        "images" : [ 
            "villa.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f563362693b511a8a7b8da9",
                "title" : "Cosy Villa For Sale !",
                "description" : "An architectural pool house boasts a professional screening room, formal bar\nand vistas to the rose gardens and beyond. Other amenities include a north-\nsouth lighted tennis court, separately constructed basketball court, a full\nguest house, greenhouses and the house manager’s quarters. Koi ponds and\nirreplaceable landscaping makes Casa Encantada arguably one of the finest\nestates in the world."
            }
        ],
        "categoryId" : 10001,
        "location" : {
            "city" : "Division No. 18",
            "state" : "Saskatchewan",
            "country" : "Canada",
            "lat_lon" : [ 
                -106.346771, 
                56.130366
            ],
            "pincode" : "S0J 2B0"
        },
        "isFree" : false,
        "userId" : 10002,
        "rate" : 15000,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "5",
                "fieldChild" : "5f5219aa8bacd50d931538e6"
            }, 
            {
                "fieldId" : "6",
                "rangeValue" : 9102
            }, 
            {
                "fieldId" : "7",
                "fieldChild" : "5f521ad68bacd50d931538f4"
            }, 
            {
                "fieldId" : "8",
                "fieldParent" : "Residential Land",
                "fieldChild" : "5f521db78bacd50d93153910"
            }
        ],
        // "createdAt" : "2020-09-07T13:19:30.317Z",
        // "updatedAt" : "2020-09-07T13:19:30.317Z",
    },
    {
        "_id" : 10018,
        "images" : [ 
            "headMassage.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f56357f693b511a8a7b8db3",
                "title" : "Indian Head Massage",
                "description" : "The relaxing affect of  head massage can have a positive effect on your sleep, by encouraging deeper, more restful sleep and helping to reduce insomnia. "
            }
        ],
        "categoryId" : 10002,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0059728, 
                40.7127753
            ]
        },
        "isFree" : false,
        "userId" : 10002,
        "rate" : 150,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "11",
                "fieldChild" : "5f5224428bacd50d9315393e"
            }, 
            {
                "fieldId" : "12",
                "rangeValue" : 41
            }, 
            {
                "fieldId" : "13",
                "fieldParent" : "Swedish massage",
                "fieldChild" : "5f5235a88bacd50d9315395e"
            }, 
            {
                "fieldId" : "15",
                "fieldChild" : "5f55dc29693b511a8a7b8d37"
            }
        ],
        // "createdAt" : "2020-09-07T13:28:31.265Z",
        // "updatedAt" : "2020-09-07T13:28:31.265Z",
    },
    {
        "_id" : 10019,
        "images" : [ 
            "weHire.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f56399f693b511a8a7b8dbf",
                "title" : "We hire Telecom Engg !!",
                "description" : "To understand the main scope, specifications and international & local statutory regulation of the assigned project’s country of operation\n\nPrepare RFQs for the Telecommuncation packages for internal review by Lead Engineer, develop engineering block diagram or specifications for inclusion to the RFQs, as required"
            }
        ],
        "categoryId" : 10003,
        "location" : {
            "city" : "Miami",
            "state" : "Florida",
            "country" : "United States",
            "lat_lon" : [ 
                -80.1917902, 
                25.7616798
            ]
        },
        "isFree" : false,
        "userId" : 10002,
        "rate" : 11400,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "2",
                "fieldChild" : "5f52109e8bacd50d931538a3"
            }, 
            {
                "fieldId" : "3",
                "rangeValue" : 2016
            }, 
            {
                "fieldId" : "4",
                "fieldChild" : "5f5219388bacd50d931538da"
            }, 
            {
                "fieldId" : "11",
                "fieldChild" : "5f5224428bacd50d9315393f"
            }, 
            {
                "fieldId" : "14",
                "fieldParent" : "BE",
                "fieldChild" : "5f55d714693b511a8a7b8d10"
            }
        ],
        // "createdAt" : "2020-09-07T13:46:07.573Z",
        // "updatedAt" : "2020-09-07T13:46:07.573Z",
    },      
    {
        "_id" : 10020,
        "images" : [ 
            "gymEqu.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f621d6822b786154b228aa0",
                "title" : "Multi-Purpose Gym Equipment ",
                "description" : "We offer all kind of Gym Equipment at low price!!\nDelivery available at door step !"
            }
        ],
        "categoryId" : 10005,
        "location" : {
            "city" : "Miami",
            "state" : "Florida",
            "country" : "United States",
            "lat_lon" : [ 
                -80.1917902, 
                25.7616798
            ]
        },
        "isFree" : false,
        "userId" : 10000,
        "rate" : 1500,
        "currencyCode" : "USD",
        "categoryFields" : [],
        // "createdAt" : "2020-09-16T14:08:02.599Z",
        // "updatedAt" : "2020-09-16T14:12:56.000Z",
    },
    {
        "_id" : 10021,
        "images" : [ 
            "singleChair.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f62171d22b786154b228a88",
                "title" : "Single Chair with Pillow",
                "description" : "Long-lasting suspension system :\n\nThis sofa is supported on a foundation of 3 inch wide elastic bands, thicker and more durable than the industry standard."
            }
        ],
        "categoryId" : 10006,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0059728, 
                40.7127753
            ]
        },
        "isFree" : false,
        "userId" : 10001,
        "rate" : 500,
        "currencyCode" : "USD",
        "categoryFields" : [],
        // "createdAt" : "2020-09-16T13:46:05.473Z",
        // "updatedAt" : "2020-09-16T13:46:05.474Z",
    },  
    {
        "_id" : 10022,
        "images" : [ 
            "sunGlass.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f621aaa22b786154b228a93",
                "title" : "Protect your Eyes !!",
                "description" : "Available in different styles, frames and lenses, including polarized sunglasses and prescription sunglasses."
            }
        ],
        "categoryId" : 10007,
        "location" : {
            "city" : "New Rochelle",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -73.7823549, 
                40.9114882
            ]
        },
        "isFree" : false,
        "userId" : 10002,
        "rate" : 10,
        "currencyCode" : "USD",
        "categoryFields" : [],
        // "createdAt" : "2020-09-16T14:01:14.008Z",
        // "updatedAt" : "2020-09-16T14:01:14.008Z",
    },
    {
        "_id" : 10023,
        "images" : [ 
            "vintageBMW.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f563a64693b511a8a7b8dc7",
                "title" : "Vintage BMW for sale",
                "description" : "Seating capacity: 5\nFuel economy: 11-17 km/l combined\nHorsepower: 140 to 195 kW\nFuel tank capacity: 60 to 68 L\nDimensions: 4,752 mm L x 1,918 mm W x 1,621 mm H\nEngine: 2.0 L 4-cylinder, 2.0 L 4-cylinder diesel, 3.0 L 6-cylinder diesel"
            }
        ],
        "categoryId" : 10000,
        "location" : {
            "city" : "New Rochelle",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -73.7823549, 
                40.9114882
            ]
        },
        "isFree" : false,
        "userId" : 10002,
        "rate" : 18500,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "7",
                "fieldChild" : "5f521ad68bacd50d931538f5"
            }, 
            {
                "fieldId" : "9",
                "rangeValue" : 12834
            }, 
            {
                "fieldId" : "10",
                "fieldParent" : "BMW",
                "fieldChild" : "5f52234e8bacd50d93153930"
            }
        ],
        // "createdAt" : "2020-09-07T13:49:24.003Z",
        // "updatedAt" : "2020-09-07T13:49:24.003Z",
    },
    {
        "_id" : 10024,
        "images" : [ 
            "spaceHere.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f563d9d693b511a8a7b8de8",
                "title" : "Get Your space here!!",
                "description" : "An entry foyer with marble staircase leads to formal living room and adjacent office. Gourmet kitchen comes with two marble islands.\n\nFamily room has wet bar in Macassar wood, and wine room has 2,200 bottle capacity.\n\nGrand master suite on second floor has morning bar, two custom master closets, and sophisticated master bathroom."
            }
        ],
        "categoryId" : 10001,
        "location" : {
            "city" : "Division No. 18",
            "state" : "Saskatchewan",
            "country" : "Canada",
            "lat_lon" : [ 
                -106.346771, 
                56.130366
            ],
            "pincode" : "S0J 2B0"
        },
        "isFree" : false,
        "userId" : 10002,
        "rate" : 54854,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "5",
                "fieldChild" : "5f5219aa8bacd50d931538e5"
            }, 
            {
                "fieldId" : "6",
                "rangeValue" : 12086
            }, 
            {
                "fieldId" : "7",
                "fieldChild" : "5f521ad68bacd50d931538f4"
            }, 
            {
                "fieldId" : "8",
                "fieldParent" : "Residential Land",
                "fieldChild" : "5f521db78bacd50d9315390f"
            }
        ],
        // "createdAt" : "2020-09-07T13:52:42.780Z",
        // "updatedAt" : "2020-09-07T14:03:09.000Z",
    },
    {
        "_id" : 10025,
        "images" : [ 
            "stoneMassage.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f563c03693b511a8a7b8ddb",
                "title" : "Hot Stone Massage",
                "description" : "When there is built-up tension in the head, neck, shoulders and upper back, it can often lead to headaches and/ or migraines. Similarly, when you are stressed this can result in tension headaches."
            }
        ],
        "categoryId" : 10002,
        "location" : {
            "city" : "Division No. 18",
            "state" : "Saskatchewan",
            "country" : "Canada",
            "lat_lon" : [ 
                -106.346771, 
                56.130366
            ],
            "pincode" : "S0J 2B0"
        },
        "isFree" : false,
        "userId" : 10002,
        "rate" : 450,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "11",
                "fieldChild" : "5f5224428bacd50d9315393e"
            }, 
            {
                "fieldId" : "12",
                "rangeValue" : 30
            }, 
            {
                "fieldId" : "13",
                "fieldParent" : "Hot stone massage",
                "fieldChild" : "5f5235a88bacd50d9315395b"
            }, 
            {
                "fieldId" : "15",
                "fieldChild" : "5f55dc29693b511a8a7b8d36"
            }
        ],
        // "createdAt" : "2020-09-07T13:56:19.367Z",
        // "updatedAt" : "2020-09-07T13:56:19.367Z",
    },
    {
        "_id" : 10026,
        "images" : [ 
            "shipment.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f563cd4693b511a8a7b8de7",
                "title" : "Shipment Management",
                "description" : "1. Graduate / Post- Graduate\n2. Fluent in English compulsory\n3. Computer Knowledge\n4. English writing skills\nJob Location :- Kalkaji\n5 Days Working (Monday to Friday)\nShift Timing :- 6:30pm to 5:30am (Night Shift)"
            }
        ],
        "categoryId" : 10003,
        "location" : {
            "city" : "Miami",
            "state" : "Florida",
            "country" : "United States",
            "lat_lon" : [ 
                -80.1917902, 
                25.7616798
            ]
        },
        "isFree" : false,
        "userId" : 10002,
        "rate" : 15000,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "2",
                "fieldChild" : "5f52109e8bacd50d931538a3"
            }, 
            {
                "fieldId" : "3",
                "rangeValue" : 2018
            }, 
            {
                "fieldId" : "4",
                "fieldChild" : "5f5219388bacd50d931538d7"
            }, 
            {
                "fieldId" : "11",
                "fieldChild" : "5f5224428bacd50d9315393f"
            }, 
            {
                "fieldId" : "14",
                "fieldParent" : "ARTS",
                "fieldChild" : "5f55d714693b511a8a7b8d0b"
            }
        ],
        // "createdAt" : "2020-09-07T13:59:48.463Z",
        // "updatedAt" : "2020-09-07T13:59:48.463Z",
    }, 
    {
        "_id" : 10027,
        "images" : [ 
            "headPhone.jpeg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f6218c222b786154b228a8e",
                "title" : "Sony Boom !!!",
                "description" : "*Digital Noise Cancelling with HD Noise Cancelling Processor       N1 and Dual Noise Sensor Technology\n*HD Hybrid Driver System\n*Smart listening experience by Adaptive Sound Control for a perfect noise cancelling experience"
            }
        ],
        "categoryId" : 10004,
        "location" : {
            "city" : "New Rochelle",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -73.7823549, 
                40.9114882
            ]
        },
        "isFree" : false,
        "userId" : 10000,
        "rate" : 150,
        "currencyCode" : "USD",
        "categoryFields" : [],
        // "createdAt" : "2020-09-16T13:53:06.873Z",
        // "updatedAt" : "2020-09-16T13:53:06.873Z",
    }, 
    {
        "_id" : 10028,
        "images" : [ 
            "basketBall.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f621cd522b786154b228a9d",
                "title" : "Kid Basket Ball !!",
                "description" : "Kid basket ball for sale at low price !\nBe active by engaging with a sport !!\nWe offer discount for all sport items \n"
            }
        ],
        "categoryId" : 10005,
        "location" : {
            "city" : "Miami",
            "state" : "Florida",
            "country" : "United States",
            "lat_lon" : [ 
                -80.1917902, 
                25.7616798
            ]
        },
        "isFree" : false,
        "userId" : 10000,
        "rate" : 25,
        "currencyCode" : "USD",
        "categoryFields" : [],
        // "createdAt" : "2020-09-16T14:10:29.964Z",
        // "updatedAt" : "2020-09-16T14:10:29.964Z",
    },
    {
        "_id" : 10029,
        "images" : [ 
            "dinning.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f62175822b786154b228a8a",
                "title" : "Couple Dining Table !!",
                "description" : "Style - Modern\n\nName - Polo\n\nFabric - Molfino\n\nCushion - Firm\n\nSize - Standard"
            }
        ],
        "categoryId" : 10006,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0059728, 
                40.7127753
            ]
        },
        "isFree" : false,
        "userId" : 10001,
        "rate" : 750,
        "currencyCode" : "USD",
        "categoryFields" : [],
        // "createdAt" : "2020-09-16T13:47:04.539Z",
        // "updatedAt" : "2020-09-16T13:47:04.539Z",
    },  
    {
        "_id" : 10030,
        "images" : [ 
            "usedBenz.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f56420d693b511a8a7b8df0",
                "title" : "Used Benz C - Class for sale !!",
                "description" : "Drivability. New 2.0-litre engine is equally comfortable if you’re stuck in traffic or belting it on the highway.\nEfficiency. With 14.37kmpl inside the city and 21.40kmpl on the highway, it’s frugal to run daily."
            }
        ],
        "categoryId" : 10000,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0059728, 
                40.7127753
            ]
        },
        "isFree" : false,
        "userId" : 10001,
        "rate" : 150000,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "7",
                "fieldChild" : "5f521ad68bacd50d931538f5"
            }, 
            {
                "fieldId" : "9",
                "rangeValue" : 14428
            }, 
            {
                "fieldId" : "10",
                "fieldParent" : "Benz",
                "fieldChild" : "5f52234e8bacd50d9315392d"
            }
        ],
        // "createdAt" : "2020-09-07T14:22:05.250Z",
        // "updatedAt" : "2020-09-07T14:22:05.250Z",
    },
    {
        "_id" : 10031,
        "images" : [ 
            "threeStory.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f564289693b511a8a7b8dfa",
                "title" : "Three Story Villa For Sale",
                "description" : "Residence features include direct elevator entry with fingerprint recognition technology, floor to ceiling bronze Schuco gridded insulated and laminated glass wall system. Wraparound terraces with Roman travertine ceilings and Brazilian Ipe decks, and expansive living, dining and entertaining area with Roman travertine accent wall and linear cove lighting. Flooring is luxurious 11” wide 10-foot long Italian White Oak with brushed pearl finish."
            }
        ],
        "categoryId" : 10001,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0059728, 
                40.7127753
            ]
        },
        "isFree" : false,
        "userId" : 10001,
        "rate" : 130000,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "5",
                "fieldChild" : "5f5219aa8bacd50d931538e6"
            }, 
            {
                "fieldId" : "6",
                "rangeValue" : 17136
            }, 
            {
                "fieldId" : "7",
                "fieldChild" : "5f521ad68bacd50d931538f5"
            }, 
            {
                "fieldId" : "8",
                "fieldParent" : "Residential Land",
                "fieldChild" : "5f521db78bacd50d9315390e"
            }
        ],
        // "createdAt" : "2020-09-07T14:24:09.541Z",
        // "updatedAt" : "2020-09-07T14:24:09.541Z",
    },
    {
        "_id" : 10032,
        "images" : [ 
            "swedish.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f5642fb693b511a8a7b8e04",
                "title" : "Swedish Head Massage",
                "description" : "Swedish head massage targets these areas, helping to reduce any muscle tension that could be causing the headaches, whilst the relaxing side of the massage will help to alleviate a tension headache."
            }
        ],
        "categoryId" : 10002,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0059728, 
                40.7127753
            ]
        },
        "isFree" : false,
        "userId" : 10001,
        "rate" : 499,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "11",
                "fieldChild" : "5f5224428bacd50d9315393e"
            }, 
            {
                "fieldId" : "12",
                "rangeValue" : 46
            }, 
            {
                "fieldId" : "13",
                "fieldParent" : "Swedish massage",
                "fieldChild" : "5f5235a88bacd50d9315395e"
            }, 
            {
                "fieldId" : "15",
                "fieldChild" : "5f55dc29693b511a8a7b8d37"
            }
        ],
        // "createdAt" : "2020-09-07T14:26:03.652Z",
        // "updatedAt" : "2020-09-07T14:26:03.652Z",
    },
    {
        "_id" : 10033,
        "images" : [ 
            "seniorSys.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f5643aa693b511a8a7b8e10",
                "title" : "Senior System Engg !!",
                "description" : "The Workload Automation and Integration group is responsible for engineering and support of the IT infrastructure for Visa Inc. and VisaNet via Vendor Tools and Homegrown Utilities. This Sr. Systems Engineer role is an individual contributor role responsible for identifying and resolving issues of moderate complexity. This position is at an intermediate professional level and requires strong execution and analytical abilities. This role works independently and receives minimal guidance."
            }
        ],
        "categoryId" : 10003,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0059728, 
                40.7127753
            ]
        },
        "isFree" : false,
        "userId" : 10001,
        "rate" : 11000,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "2",
                "fieldChild" : "5f52109e8bacd50d931538a2"
            }, 
            {
                "fieldId" : "3",
                "rangeValue" : 2012
            }, 
            {
                "fieldId" : "4",
                "fieldChild" : "5f5219388bacd50d931538da"
            }, 
            {
                "fieldId" : "11",
                "fieldChild" : "5f5224428bacd50d9315393e"
            }, 
            {
                "fieldId" : "14",
                "fieldParent" : "BE",
                "fieldChild" : "5f55d714693b511a8a7b8d0e"
            }
        ],
        // "createdAt" : "2020-09-07T14:28:58.714Z",
        // "updatedAt" : "2020-09-07T14:28:58.714Z",
    },
    {
        "_id" : 10034,
        "images" : [ 
            "smartWatch.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f62196522b786154b228a91",
                "title" : "Smart watch - 1 month old !!",
                "description" : "We sell smart watches  at low price ! \nGrab soon ! \nLimited offer !!"
            }
        ],
        "categoryId" : 10004,
        "location" : {
            "city" : "Jersey City",
            "state" : "New Jersey",
            "lat_lon" : [ 
                -74.0381184, 
                40.727141
            ],
            "pincode" : "07310"
        },
        "isFree" : false,
        "userId" : 10000,
        "rate" : 10,
        "currencyCode" : "USD",
        "categoryFields" : [],
        // "createdAt" : "2020-09-16T13:54:44.966Z",
        // "updatedAt" : "2020-09-16T13:55:49.000Z",
    },
    {
        "_id" : 10035,
        "images" : [ 
            "jeep.jpg"
        ],
        "viewers" : [],
        "isDeleted" : false,
        "likedUsers" : [],
        "sellingStatus" : "ForSale",
        "status" : "Approved",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f55e108693b511a8a7b8d4a",
                "title" : "Jeep ",
                "description" : "Magnetic Metallic 2016 Modified BMW EcoBoost RWD 6-Speed EcoBoost 2.3L I4 GTDi DOHC Turbocharged VCT ABS brakes, Compass, Electronic Stability Control, Illuminated entry, Low tire pressure warning, Remote keyless entry, Traction control.\nRecent Arrival!"
            }
        ],
        "categoryId" : 10000,
        "location" : {
            "city" : "New York",
            "state" : "New York",
            "country" : "United States",
            "lat_lon" : [ 
                -74.0059728, 
                40.7127753
            ]
        },
        "isFree" : false,
        "userId" : 10002,
        "rate" : 10000,
        "currencyCode" : "USD",
        "categoryFields" : [ 
            {
                "fieldId" : "7",
                "fieldChild" : "5f521ad68bacd50d931538f4"
            }, 
            {
                "fieldId" : "9",
                "rangeValue" : 54055
            }, 
            {
                "fieldId" : "10",
                "fieldParent" : "Tesla",
                "fieldChild" : "5f52234e8bacd50d9315392a"
            }
        ],
        // "createdAt" : "2020-09-07T07:28:08.373Z",
        // "updatedAt" : "2020-09-07T07:28:08.373Z"
    }
];

module.exports = {
    categorySeed,
    timezoneSeed,
    currencySeed,
    countrySeed,
    userSeed,
    productSeed,
    adminSeed,
    siteSeed,
    reportSeed,
    reviewSeed,
    blockSeed,
    uReportSeed,
    pReportSeed,
    notificationSeed,
    feedBackSeed,
    mailtempSeed,
    deletechatSeed,
    contactUsSeed,
    featuredSeed,
    adBannerSeed,
    languageSeed,
    staticPagesSeed,
    metatagsSeed,
    filterSeed
};
