import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import Cookies from 'js-cookie';
import APIConstant, { CommonConfig } from '../../utils/constants';
import api from '../../utils/apiClient';

import {
	AppAside,
	AppFooter,
	AppHeader,
	AppSidebar,
	AppSidebarFooter,
	AppSidebarForm,
	AppSidebarHeader,
	AppSidebarMinimizer,
	AppBreadcrumb2 as AppBreadcrumb,
	AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
import navigationLimited from '../../_navigationLimited';
// routes config
import routes from '../../routes';
import { isNull } from 'lodash';
import { toast } from 'react-toastify';
import DefaultHeader from './DefaultHeader';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
// const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

	loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

	async signOut(e) {
		e.preventDefault();
		await this.releaseLock();
		localStorage.removeItem('access_token');
		localStorage.removeItem('loggedInUserData');
		// Cookies.remove('access_token');
		// Cookies.remove('loggedInUserData');
		this.props.history.push('/login');
	}

	// changePassword = e => {
	//   this.props.history.push('/changePassword');
	// }
	async releaseLock(){
        let data = {
            'PolicyId' : '',
            'ReleaseAll' : 1
        };
        
        await api.post('api/releaseLock', data).then(res => {
            if (res.success) {
                if(res.data[0][0].returnValue==''){
                    toast.success("Policy unlocked Successfully");  
                }else{
                    toast.warn(res.data[0][0].returnValue);
                }
                
            } else {
                toast.warn("SomeThing went wrong.");
            }
        }).catch(err => {
            console.log("setLock err", err);
        });

    }
	componentDidMount() {

		this.navData = '';

		document.body.classList.remove('brand-minimized');
		window.scrollTo(0, 0);

		(async () => {
			try {

				var UserData = await CommonConfig.loggedInUserData();
				if (!CommonConfig.isEmpty(UserData)) {
					if (UserData.Email === "fina@yachtsman.es") {
						this.navData = navigationLimited;
					} else {
						this.navData = navigation;
					}
				} else {
					toast.error('Please login in to Evolution.');
					this.props.history.push('/login');
				}

			} catch (e) {
				toast.error('Please login in to Evolution.');
				this.props.history.push('/login');
			}
		})();
	}

	mouseEnterSidebar() {
		var isExist = document.body.classList.contains("sidebar-minimized");
		if (isExist !== 1) {
			document.body.classList.remove('sidebar-minimized');
			document.body.classList.remove('brand-minimized');
		}
	}

	mouseLeaveSidebar() {
		document.body.classList.add('sidebar-minimized');
		document.body.classList.remove('brand-minimized');
	}

	render() {

		return (
			<div className="app">
				<AppHeader fixed>
					<Suspense fallback={this.loading()}>
						<DefaultHeader {...this.props}
							onLogout={e => this.signOut(e)}
						// changePassword={e => this.changePassword(e)} 
						/>
					</Suspense>
				</AppHeader>

				<div className="app-body">
					<AppSidebar fixed minimized display="lg"
						onMouseEnter={this.mouseEnterSidebar}
						onMouseLeave={this.mouseLeaveSidebar}
					>
						<AppSidebarHeader />

						<AppSidebarForm />

						<Suspense>
							{/* <AppSidebarNav navConfig={navigation} {...this.props} router={router} /> */}
							<AppSidebarNav navConfig={(this.navData === null) ? navigation : this.navData} {...this.props} router={router} />
						</Suspense>

						<AppSidebarFooter />

						{/* <AppSidebarMinimizer /> */}
					</AppSidebar>

					<main className="main">
						<AppBreadcrumb appRoutes={routes} router={router} />

						<Container fluid>
							<Suspense fallback={this.loading()}>
								<Switch>
									{routes.map((route, idx) => {
										return route.component ? (
											<Route
												key={idx}
												path={route.path}
												exact={route.exact}
												name={route.name}
												render={props => (
													<route.component {...props} />
												)} />
										) : (null);
									})}
									<Redirect from="/" to="/dashboard" />
								</Switch>
							</Suspense>
						</Container>
					</main>

					<AppAside fixed>
						<Suspense fallback={this.loading()}>
							<DefaultAside />
						</Suspense>
					</AppAside>
				</div>

				<AppFooter>
					<Suspense fallback={this.loading()}>
						<DefaultFooter />
					</Suspense>
				</AppFooter>
			</div>
		);
	}
}

export default DefaultLayout;