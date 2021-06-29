
import { 
  dashboardComponent,
  AdminComponent,
  AdminUserComponent,
  UserComponent,
  UserViewComponent,
  productComponent,
  productInfoComponent,
  CategoryListComponent,
  CategoryInfoComponent,
  MakeListComponent,
  MakeInfoComponent,
  ServiceListComponent,
  ServiceInfoComponent,
  DriveTrainComponent,
  DriveTrainInfoComponent,
  BodyTypeComponent,
  BodyTypeInfoComponent,
  FuelTypeComponent,
  FuelTypeInfoComponent,
  TransmissionComponent,
  TransmissionInfoComponent,
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
  FeedbackIcon,
  BlockIcon,
  ReportIcon,
  ReportIconUser,
  ReasonIcon,
  CurrencyIcon,
  CarIcon,
  SearchIcon,
  RateReviewIcon,
  ReceiptIcon,
  FeaturedVideoIcon,
  ViewCarouselIcon,
  TranslateIcon,
  PagesIcon,
  LocalOfferIcon,
  SendEmailComponent,
  FilterViewComponent,
  FilterListComponent
} from "./ImportTitles.js";



var dashRoutes = [
  {
    path: "/admin/dashboard",
    name: "Dashboard",
    icon: DashboardIcon,
    component: dashboardComponent
  },
  {
    path: "/admin/adminUsers",
    name: "Manage Admin",
    component: AdminComponent,
    icon: Admin
  },
  {
    path: "/admin/users",
    name: "Manage Users",
    component: UserComponent,
    icon: UserIcon
  },
  {
    path: "/admin/adminUsers-manageAdd",
    name: "Add Admin",
    nosideBar: true,
    component: AdminUserComponent,
  },
  {
    path: "/admin/adminUsers-editAdmin/:id",
    nosideBar: true,
    name: "Edit Admin",
    component: AdminUserComponent,
  },
  {
    name: "Add User",
    nosideBar: true,
    path: "/admin/users-addUser",
    component: UserViewComponent,
  },
  {
    path: "/admin/users-editUser/:id",
    nosideBar: true,
    name: "Edit User",
    component: UserViewComponent,
  },
  {
    path: "/admin/products",
    name: "Manage Products",
    component: productComponent,
    icon: ProductIcon
  },
  {
    name: "Add Product",
    nosideBar: true,
    path: "/admin/products-addProduct",
    component: productInfoComponent
  },
  {
    path: "/admin/products-editProduct/:id",
    nosideBar: true,
    name: "Edit Product",
    component: productInfoComponent
  },
  {
    path: "/admin/categories",
    name: "Manage Categories",
    component: CategoryListComponent,
    icon: CategoryIcon
  },
  {
    name: "Add Category",
    nosideBar: true,
    path: "/admin/categories-addCategory",
    component: CategoryInfoComponent
  },
  {
    path: "/admin/categories-editCategory/:id",
    nosideBar: true,
    name: "Edit Category",
    component: CategoryInfoComponent
  },
  {
    path: "/admin/filters",
    name: "Manage Filters",
    component: FilterListComponent,
    icon: SearchIcon
  },
  {
    name: "Add Filters",
    nosideBar: true,
    path: "/admin/filters-addFilter",
    component: FilterViewComponent
  },
  {
    path: "/admin/filters-editFilter/:id",
    nosideBar: true,
    name: "Edit Filters",
    component: FilterViewComponent
  },
  // {
  //   collapse: true,
  //   path: "/admin",
  //   name: "Manage Emails",
  //   state: "openComponentsEmail",
  //   icon: FeedbackIcon,
  //   views: [
  //     {
  //       path: "/admin/sendEmail",
  //       name: "send Email",
  //       component: SendEmailComponent,
  //       mini: "SM"
  //     },
  //   ]
  // },
  {
    path: "/admin/siteSettings",
    name: "Manage Site Settings",
    component: SettingsComponent,
    icon: Settings
  },
  {
    path: "/admin/reviews",
    name: "Manage Reviews",
    component: ReviewComponent,
    icon: RateReviewIcon
  },

  {
    path: "/admin/contactus",
    name: "Manage FeedBack",
    component: ContactUsComponent,
    icon: FeedbackIcon
  },
  {
    path: "/admin/blockedUsers",
    name: "Manage Blocked Users",
    component: BListComponent,
    icon: BlockIcon
  },
  {
    path: "/admin/reportedUsers",
    name: "Reported Users List",
    component: ReportedUserListComponent,
    icon: ReportIconUser
  },
  {
    path: "/admin/reportedProducts",
    name: "Reported Products List",
    component: ReportedProductListComponent,
    icon: ReportIcon
  },  
  {
    path: "/admin/TransactionList",
    name: "Manage Transactions",
    component: TransactionsComponent,
    icon: ReceiptIcon
  },
  {
    path: "/admin/featureList",
    name: "Manage Feature List",
    component: FeatureListComponent,
    icon: FeaturedVideoIcon
  },

  {
    path: "/admin/manageBanner",
    name: "Manage Banner",
    component: mBannerComponent,
    icon: ViewCarouselIcon
  },

  {
    name: "Edit Banner",
    path: "/admin/manageBanner-editBanner/:id",
    nosideBar: true,
    component: bFormInfoComponent,
    icon: ReportIcon,
    
  },
  {
    path: "/admin/manageBanner-addBanner",
    name: "Add Banner",
    component: bFormInfoComponent,
    icon: ReportIcon,
    nosideBar: true 
  },

  {
    path: "/admin/ManageLanguage",
    name: "Manage Language",
    component: LanguageComponent,
    icon: TranslateIcon
  },
  {
    path: "/admin/ManageLanguage-languages/:id",
    name: "Edit Languages",
    component: LanguageInfoComponent,
    nosideBar: true 
  },
  {
    path: "/admin/ManageLanguage-addLanguage",
    name: "Add Languages",
    component: LanguageInfoComponent,
    nosideBar: true 
  },
  {
    path: "/admin/staticPages",
    name: "Manage Static Pages",
    component: StaticPagesListComponent,
    icon: PagesIcon
  },
  {
    path: "/admin/staticPages-addStaticPages",
    name: "Add Static Pages",
    component: StaticPagesInfoComponent,
    nosideBar: true 
  },
  {
    path: "/admin/staticPages-editStaticPages/:id",
    name: "Edit Static Pages",
    component: StaticPagesInfoComponent,
    nosideBar: true 
  },
  {
    name: "Add Feature",
    nosideBar: true,
    path: "/admin/featureList-addFeature",
    component: FeatureInfoComponent

  },
  {
    path: "/admin/featureList-editFeature/:id",
    nosideBar: true,
    name: "Edit Feature",
    component: FeatureInfoComponent
  },
  {
    path: "/admin/reportReasons-addReportReason",
    nosideBar: true,
    name: "Add Report Reason",
    component: ReportInfoComponent
  },
  {
    path: "/admin/reportReasons-editReportReason/:id",
    nosideBar: true,
    name: "Edit Report Reason",
    component: ReportInfoComponent
  },
  {
    path: "/admin/reportReasons",
    name: "Manage Report-Reasons",
    component: ReportComponent,
    icon: ReasonIcon
  },
  {
    path: "/admin/MetasList",
    name: "Manage Metas",
    component: MetaListComponent,
    icon: LocalOfferIcon
  },

  {
    path: "/admin/MetasList-editMetas/:id",
    nosideBar: true,
    name: "Edit Metas",
    component: MetaInfoComponent

  },
  
  {
    name: "Add Metas",
    nosideBar: true,
    path: "/admin/MetasList-addMetas",
    component: MetaInfoComponent
  },


  {
    path: "/admin/currencies",
    name: "Manage Currency",
    component: CurrencyListComponent,
    icon: CurrencyIcon
  },
  {
    name: "Add Currency",
    nosideBar: true,
    path: "/admin/currencies-addCurrency",
    component: CurrencyInfoComponent
  },
  {
    path: "/admin/currencies-editCurrency/:id",
    nosideBar: true,
    name: "Edit Currency",
    component: CurrencyInfoComponent
  }
];
export default dashRoutes;
