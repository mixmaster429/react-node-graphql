
// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import Settings from "@material-ui/icons/SettingsApplications";
import UserIcon from "@material-ui/icons/SupervisorAccount";
import Admin from "@material-ui/icons/SupervisedUserCircle";
import ProductIcon from "@material-ui/icons/ShoppingBasket";
import CategoryIcon from "@material-ui/icons/Category";
import ServiceIcon from "@material-ui/icons/SettingsInputAntenna";
import FuelIcon from "@material-ui/icons/LocalGasStation";
import TransmissionIcon from "@material-ui/icons/CallSplit";
import DriveTrain from "@material-ui/icons/SettingsInputSvideo";
import BodyIcon from "@material-ui/icons/DirectionsCar";
import MakeIcon from "@material-ui/icons/WbIncandescent";
import FeedbackIcon from '@material-ui/icons/Feedback';
import BlockIcon from "@material-ui/icons/Block";
import ReportIcon from "@material-ui/icons/Report";
import ReportIconUser from "@material-ui/icons/ReportProblem";
import ReasonIcon from "@material-ui/icons/BugReport";
import CurrencyIcon from "@material-ui/icons/AttachMoney";
import CarIcon from "@material-ui/icons/DirectionsCar";
import Fingerprint from "@material-ui/icons/Fingerprint";
import SearchIcon from '@material-ui/icons/Search';
import RateReviewIcon from '@material-ui/icons/RateReview';
import ReceiptIcon from '@material-ui/icons/Receipt';
import FeaturedVideoIcon from '@material-ui/icons/FeaturedVideo';
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';
import TranslateIcon from '@material-ui/icons/Translate';
import PagesIcon from '@material-ui/icons/Pages';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
// Components
import Dashboard from "../views/Dashboard/Dashboard.jsx";
import AdminList from "../views/AdminPages/Admin/AdminList.jsx";
import AdminUser from "../views/AdminPages/Admin/AdminUser.jsx";
import User from "../views/AdminPages/User/User.jsx";
import UserList from "../views/AdminPages/User/UserList.jsx";
import ProductsList from "../views/AdminPages/Product/ProductsList.jsx";
import Product from "../views/AdminPages/Product/ProductInfo.jsx";
import CategoryList from "../views/AdminPages/Category/CategoryList.jsx";
import Category from "../views/AdminPages/Category/Category.jsx";
import ReasonsList from "../views/AdminPages/ReportReasons/reasonList.jsx";
import Reason from "../views/AdminPages/ReportReasons/reason.jsx";
import SiteSettings from "../views/AdminPages/SiteSettings/Setting.jsx";
import ReviewList from "../views/AdminPages/Review/ReviewList.js";
import urList from "../views/AdminPages/ReportedUsers/ReportedList.jsx";
import prList from "../views/AdminPages/ReportedProducts/ReportedList.jsx";
import fList from "../views/AdminPages/Feature/FeatureList.jsx";
import fUser from  "../views/AdminPages/Feature/Feature.jsx";
import mBanner from "../views/AdminPages/ManageBanner/BannerList.jsx";
import bForm from "../views/AdminPages/ManageBanner/BannerForm.jsx";
import BList from "../views/AdminPages/Blocked/BlockedList.jsx";
import ContactList from "../views/AdminPages/ContactUs/ContactUs.jsx";
import CurrencyList from "../views/AdminPages/Currency/CurrencyList.jsx";
import Currency from "../views/AdminPages/Currency/Currency.jsx";
import TList from "../views/AdminPages/Transactions/TransactionList.js";
import LList from "../views/AdminPages/Language/LanguageList.js";
import LForm from "../views/AdminPages/Language/LanguageForm.js";
import sPages from "../views/AdminPages/Static Pages/StaticPagesList.js";
import sForm from "../views/AdminPages/Static Pages/StaticPageForm.js";
import sendEmail from "../views/AdminPages/manageEmail/SendEmail.jsx"
import MetasList from "../views/AdminPages/Metas/MetasList.jsx";
import Metas from "../views/AdminPages/Metas/Metas.jsx";
import LoginPage from "../views/AdminPages/Login/LoginPage.jsx";
import Reset from "../views/AdminPages/Reset.jsx";
import userDashboard from "../views/UserPages/index.js";
import ProductDetails from "../views/UserPages/Dashboard/ProductDetails.jsx";
import SellerDetails from "../views/UserPages/Dashboard/SellerDetails.jsx";
import Chat from "../views/UserPages/Chat/index.jsx";
import Contact from "../views/UserPages/Dashboard/Contact.jsx";
import Editprofile from "../views/UserPages/Dashboard/EditProfile.jsx";
import StaticPages from "../views/UserPages/Footer/StaticPages.jsx";
import appleLogin from "../views/UserPages/Dashboard/appleLogin";

import FilterView from "../views/AdminPages/Filter/FilterView";
import FilterList from "../views/AdminPages/Filter/FilterList";

import withTitle from "./WithTitle.jsx";

/* ------------------------------------- Admin panel------------------------------------------------------- */
//dashboard
const dashboardComponent = withTitle({ component: Dashboard});

//Admin add or Edit
const AdminComponent = withTitle({ component: AdminList});
const AdminUserComponent = withTitle({ component: AdminUser});

//User add or Edit
const UserComponent = withTitle({ component: UserList});
const UserViewComponent = withTitle({ component: User});

//product add or Edit
const productComponent = withTitle({ component: ProductsList});
const productInfoComponent = withTitle({ component: Product});

//category add or Edit
const CategoryListComponent = withTitle({ component: CategoryList});
const CategoryInfoComponent = withTitle({ component: Category});

//Site settings
const SettingsComponent = withTitle({ component: SiteSettings});

//Review 
const ReviewComponent = withTitle({ component: ReviewList});

//ContactUs
const ContactUsComponent = withTitle({ component: ContactList});

//BlockedList
const BListComponent = withTitle({ component: BList});

//ReportedUserList
const ReportedUserListComponent = withTitle({ component: urList});

//ReportedProductList
const ReportedProductListComponent = withTitle({ component: prList});

//Transactions List
const TransactionsComponent = withTitle({ component: TList});

//Feature management
const FeatureListComponent = withTitle({ component: fList});
const FeatureInfoComponent = withTitle({ component: fUser});


//Banner management
const mBannerComponent = withTitle({ component: mBanner});
const bFormInfoComponent = withTitle({ component: bForm});


//Language Management
const LanguageComponent = withTitle({ component: LList});
const LanguageInfoComponent = withTitle({ component: LForm});

//Report Reason management
const ReportComponent = withTitle({ component: ReasonsList });
const ReportInfoComponent = withTitle({ component: Reason});

//Meta Management 
const MetaListComponent = withTitle({ component: MetasList});
const MetaInfoComponent = withTitle({ component: Metas });

//Static Pages Management 
const StaticPagesListComponent = withTitle({ component: sPages });
const StaticPagesInfoComponent = withTitle({ component: sForm });

//currency management
const CurrencyListComponent = withTitle({ component: CurrencyList });
const CurrencyInfoComponent = withTitle({ component: Currency });

//Send Email management
const SendEmailComponent = withTitle({ component: sendEmail });
//const CurrencyInfoComponent = withTitle({ component: Currency });


//Filter management

const FilterViewComponent = withTitle({component: FilterView})
const FilterListComponent = withTitle({component: FilterList})


/* ------------------------------------- End Admin panel------------------------------------------------------- */

/* ------------------------------------- User Panel ------------------------------------------------------- */

const dashboardUserComponent = withTitle({ component: userDashboard});
const ProductDetailsComponent = withTitle({ component: ProductDetails});
const EditprofileComponent = withTitle({ component: Editprofile});
const AdminLoginComponent = withTitle({ component: LoginPage});
const ContactUsUserComponent = withTitle({ component: Contact });
const ResetComponent = withTitle({ component: Reset});
const SellerDetailsComponent = withTitle({ component: SellerDetails});
const ChatComponent = withTitle({ component: Chat});
const StaticComponent = withTitle({ component : StaticPages });
const AppleLoginComponent = withTitle({ component: appleLogin})

/* -------------------------------------  End User Panel------------------------------------------------------- */

export {
    dashboardComponent,
    AdminComponent,
    AdminUserComponent,
    UserComponent,
    UserViewComponent,
    productComponent,
    productInfoComponent,
    CategoryListComponent,
    CategoryInfoComponent,
    SettingsComponent,
    ReviewComponent,
    ContactUsComponent,
    BListComponent,
    ReportedUserListComponent,
    ReportedProductListComponent,
    TransactionsComponent,
    FeatureListComponent,
    FeatureInfoComponent,
    mBannerComponent,
    bFormInfoComponent,
    LanguageComponent,
    LanguageInfoComponent,
    ReportComponent,
    ReportInfoComponent,
    MetaListComponent,
    MetaInfoComponent,
    StaticPagesListComponent,
    StaticPagesInfoComponent,
    CurrencyListComponent,
    CurrencyInfoComponent,
    DashboardIcon,
    Settings,
    UserIcon,
    Admin,
    ProductIcon,
    CategoryIcon,
    ServiceIcon,
    FuelIcon,
    TransmissionIcon,
    DriveTrain,
    BodyIcon,
    MakeIcon,
    BlockIcon,
    ReportIcon,
    ReportIconUser,
    ReasonIcon,
    CurrencyIcon,
    CarIcon,
    SearchIcon,
    RateReviewIcon,
    ReceiptIcon,
    FeedbackIcon,
    FeaturedVideoIcon,
    ViewCarouselIcon,
    TranslateIcon,
    PagesIcon,
    LocalOfferIcon,
    dashboardUserComponent,
    ProductDetailsComponent,
    EditprofileComponent,
    AdminLoginComponent,
    ContactUsUserComponent,
    ResetComponent,
    SellerDetailsComponent,
    ChatComponent,
    Fingerprint,
    StaticComponent,
    SendEmailComponent,
    AppleLoginComponent,
    FilterViewComponent,
    FilterListComponent
};
