import {
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
} from './ImportTitles.js'


const pagesRoutes = [
  {
    path: "/admin/login",
    name: "Login Page",
    short: "login",
    mini: "LP",
    icon: Fingerprint,
    component: AdminLoginComponent
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    short: "dashboard",
    mini: "DH",
    component: dashboardUserComponent,
    redirect:""
  },
  {
    path: "/pages/:url",
    name: "Privacy Policy",
    short: "privacy policy",
    mini: "PP",
    component: StaticComponent
  },
  {
    path: "/Info/contact",
    name: "About Us",
    short: "about us",
    mini: "AP",
    component: ContactUsUserComponent
  },
  {
    path: "/reset-password/:id",
    name: "Reset",
    short: "reset",
    mini: "RP",
    component: ResetComponent
  },
  
  {
    path: "/EditProfile/:id",
    name: "Reset",
    short: "reset",
    mini: "RP",
    component: EditprofileComponent
  },
  {
    path: "/products/:id",
    name: "Reset",
    short: "reset",
    mini: "RP",
    component: ProductDetailsComponent
  },

  {
    path: "/SellerDetails/:userId",
    name: "Reset",
    short: "reset",
    mini: "RP",
    component: SellerDetailsComponent
  },


  {
    path: "/chat/conversation",
    name: "Reset",
    short: "reset",
    mini: "RP",
    component: ChatComponent
  },
 

  { redirect: true, path: "/reset-password/:id", pathTo: "/reset-password", name: "Reset_Password" }
];

export default pagesRoutes;
