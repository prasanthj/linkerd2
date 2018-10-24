import {
  AppBar,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Toolbar,
  Typography
} from '@material-ui/core';
import { githubIcon, linkerdWordLogo, slackIcon } from './util/SvgWrappers.jsx';

import BreadcrumbHeader from './BreadcrumbHeader.jsx';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import EmailIcon from '@material-ui/icons/Email';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import HelpIcon from '@material-ui/icons/HelpOutline';
import HomeIcon from '@material-ui/icons/Home';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigationResources from './NavigationResources.jsx';
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import PropTypes from 'prop-types';
import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import Version from './Version.jsx';
import VisibilityIcon from '@material-ui/icons/Visibility';
import classNames from 'classnames';
import { withContext } from './util/AppContext.jsx';
import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 250;
const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "100vh",
    width: "100%",
    zIndex: 1,
    overflowX: 'scroll',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    width: `calc(100% - ${drawerWidth}px)`,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
  linkerdLogoContainer: {
    backgroundColor: theme.palette.primary.dark,
  },
  linkerdNavLogo: {
    minWidth: "180px",
  },
  navMenuItem: {
    paddingLeft: "24px",
    paddingRight: "24px",
  },
});

class NavigationBase extends React.Component {
  constructor(props) {
    super(props);
    this.api = this.props.api;
    this.handleApiError = this.handleApiError.bind(this);

    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      drawerOpen: true,
      resourceMenuOpen: false,
      helpMenuOpen: false,
      latestVersion: '',
      isLatest: true,
      namespaceFilter: "all"
    };
  }

  componentDidMount() {
    this.fetchVersion();
  }

  fetchVersion() {
    let versionUrl = `https://versioncheck.linkerd.io/version.json?version=${this.props.releaseVersion}&uuid=${this.props.uuid}&source=web`;
    this.versionPromise = fetch(versionUrl, { credentials: 'include' })
      .then(rsp => rsp.json())
      .then(versionRsp => {
        let latestVersion;
        let parts = this.props.releaseVersion.split("-", 2);
        if (parts.length === 2) {
          latestVersion = versionRsp[parts[0]];
        }
        this.setState({
          latestVersion,
          isLatest: latestVersion === this.props.releaseVersion
        });
      }).catch(this.handleApiError);
  }

  handleApiError(e) {
    this.setState({
      error: e
    });
  }

  handleDrawerOpen = () => {
    this.setState({ drawerOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  };

  handleResourceMenuClick = () => {
    this.setState(state => ({ resourceMenuOpen: !state.resourceMenuOpen }));
  };

  handleHelpMenuClick = () => {
    this.setState(state => ({ helpMenuOpen: !state.helpMenuOpen }));
  }

  menuItem(path, title, icon) {
    const { classes, api } = this.props;
    let normalizedPath = this.props.location.pathname.replace(this.props.pathPrefix, "");
    let isCurrentPage = path => path === normalizedPath;

    return (
      <MenuItem
        component={Link}
        to={api.prefixLink(path)}
        className={classes.navMenuItem}
        selected={isCurrentPage(path)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </MenuItem>
    );
  }
  render() {
    const { classes, ChildComponent } = this.props;

    return (
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, {[classes.appBarShift]: this.state.drawerOpen} )}>
          <Toolbar disableGutters={!this.state.drawerOpen}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, {[classes.hide]: this.state.drawerOpen} )}>
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" color="inherit" noWrap>
              <BreadcrumbHeader {...this.props} />
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, {[classes.drawerPaperClose]: !this.state.drawerOpen} ),
          }}
          open={this.state.drawerOpen}>
          <div className={classNames(classes.linkerdLogoContainer, classes.toolbar)}>
            <div className={classes.linkerdNavLogo}>
              {linkerdWordLogo}
            </div>
            <IconButton className="drawer-toggle-btn" onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>

          <Divider />

          <MenuList>
            { this.menuItem("/overview", "Overview", <HomeIcon />) }
            { this.menuItem("/tap", "Tap", <VisibilityIcon />) }
            { this.menuItem("/top", "Top", <NetworkCheckIcon />) }
            { this.menuItem("/servicemesh", "Service Mesh", <CloudQueueIcon />) }
            <NavigationResources />
          </MenuList>

          <Divider />

          <MenuList>
            <ListItem component="a" href="https://linkerd.io/2/overview/" target="_blank">
              <ListItemIcon><LibraryBooksIcon /></ListItemIcon>
              <ListItemText primary="Documentation" />
            </ListItem>

            <MenuItem
              className={classes.navMenuItem}
              button
              onClick={this.handleHelpMenuClick}>
              <ListItemIcon><HelpIcon /></ListItemIcon>
              <ListItemText inset primary="Help" />
              {this.state.helpMenuOpen ? <ExpandLess /> : <ExpandMore />}
            </MenuItem>
            <Collapse in={this.state.helpMenuOpen} timeout="auto" unmountOnExit>
              <MenuList dense component="div" disablePadding>
                <ListItem component="a" href="https://lists.cncf.io/g/cncf-linkerd-users" target="_blank">
                  <ListItemIcon><EmailIcon /></ListItemIcon>
                  <ListItemText primary="Join the mailing list" />
                </ListItem>

                <ListItem component="a" href="https://slack.linkerd.io" target="_blank">
                  <ListItemIcon>{slackIcon}</ListItemIcon>
                  <ListItemText primary="Join us on slack" />
                </ListItem>

                <ListItem component="a" href="https://github.com/linkerd/linkerd2/issues/new/choose" target="_blank">
                  <ListItemIcon>{githubIcon}</ListItemIcon>
                  <ListItemText primary="File an issue" />
                </ListItem>
              </MenuList>
            </Collapse>
          </MenuList>

          {
            !this.state.drawerOpen ? null : <Version
              isLatest={this.state.isLatest}
              latestVersion={this.state.latestVersion}
              releaseVersion={this.props.releaseVersion}
              error={this.state.error}
              uuid={this.props.uuid} />
          }
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className="main-content"><ChildComponent {...this.props} /></div>
        </main>
      </div>
    );
  }
}

NavigationBase.propTypes = {
  api: PropTypes.shape({
    PrefixedLink: PropTypes.func.isRequired,
  }).isRequired,
  ChildComponent: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  pathPrefix: PropTypes.string.isRequired,
  releaseVersion: PropTypes.string.isRequired,
  theme: PropTypes.shape({}).isRequired,
  uuid: PropTypes.string.isRequired,
};

export default withContext(withStyles(styles, { withTheme: true })(NavigationBase));
