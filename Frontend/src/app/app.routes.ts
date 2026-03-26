import { Routes } from '@angular/router';
import { driverGuard } from './guards/driver.guard';
import { authGuard } from './core/auth.guard';


export const routes: Routes = [

{
path:'',
loadComponent:()=>import('./home/home.component')
.then(m=>m.HomeComponent)
},

{
path:'login',
loadComponent:()=>import('./auth/login/login.component')
.then(m=>m.LoginComponent)
},

{
path:'register',
loadComponent:()=>import('./auth/register/register.component')
.then(m=>m.RegisterComponent)
},

{
path:'driver',
loadComponent:()=>import('./driver/driver-dashboard/driver-dashboard.component')
.then(m=>m.DriverDashboardComponent),
canActivate:[driverGuard]
},

{
path:'driver/profile',
loadComponent:()=>import('./driver/driver-profile/driver-profile.component')
.then(m=>m.DriverProfileComponent),
canActivate:[driverGuard]
},

{
path:'driver/history',
loadComponent:()=>import('./driver/driver-history/driver-history.component')
.then(m=>m.DriverHistoryComponent),
canActivate:[driverGuard]
},

{
path:'driver/analytics',
loadComponent:()=>import('./driver/driver-analytics/driver-analytics.component')
.then(m=>m.DriverAnalyticsComponent),
canActivate:[driverGuard]
},

{
path:'admin',
children:[

{
path:'',
loadComponent:()=>import('./admin/admin-dashboard/admin-dashboard.component')
.then(m=>m.AdminDashboardComponent)
},

{
path:'rides',
loadComponent:()=>import('./admin/admin-rides/admin-rides.component')
.then(m=>m.AdminRidesComponent)
},

{
path:'users',
loadComponent:()=>import('./admin/admin-users/admin-users.component')
.then(m=>m.AdminUsersComponent)
},

{
path:'user-panel/:id',
loadComponent:()=>import('./admin/admin-user-panel/admin-user-panel.component')
.then(m=>m.AdminUserPanelComponent)
},

{
path:'drivers',
loadComponent:()=>import('./admin/admin-drivers/admin-drivers.component')
.then(m=>m.AdminDriversComponent)
},

{
path:'driver-panel/:id',
loadComponent:()=>import('./admin/admin-driver-panel/admin-driver-panel.component')
.then(m=>m.AdminDriverPanelComponent)
},

{
path:'reports',
loadComponent:()=>import('./admin/admin-reports/admin-reports.component')
.then(m=>m.AdminReportsComponent)
}

]
},

{
path:'user',
loadComponent:()=>import('./user/layout/user-layout.component')
.then(m=>m.UserLayoutComponent),
 canActivate:[authGuard],

children:[

{
path:'dashboard',
loadComponent:()=>import('./user/dashboard/user-dashboard.component')
.then(m=>m.UserDashboardComponent)
},

{
path:'book',
loadComponent:()=>import('./user/book-ride/book-ride.component')
.then(m=>m.BookRideComponent)
},

{
path:'history',
loadComponent:()=>import('./user/history/history.component')
.then(m=>m.HistoryComponent)
},

{
path:'profile',
loadComponent:()=>import('./user/profile/profile.component')
.then(m=>m.ProfileComponent)
},

{
path:'ride/:id',
loadComponent:()=>import('./user/ride-details/ride-details.component')
.then(m=>m.RideDetailsComponent)
},

{
path:'about',
loadComponent:()=>import('./user/about/about.component')
.then(m=>m.AboutComponent)
},

{
path:'contact',
loadComponent:()=>import('./user/contact/contact.component')
.then(m=>m.ContactComponent)
},

{
path:'',
redirectTo:'dashboard',
pathMatch:'full'
}

]
},

{
path:'**',
redirectTo:''
}

];