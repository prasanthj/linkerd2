import {
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from '@material-ui/core';

import { githubIcon, linkerdWordLogo, slackIcon } from './util/SvgWrappers.jsx';
import { Link } from 'react-router-dom';
import EmailIcon from '@material-ui/icons/Email';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigationResource from './NavigationResource.jsx';
import PropTypes from 'prop-types';
import React from 'react';
import ViewListIcon from '@material-ui/icons/ViewList';
import { withContext } from './util/AppContext.jsx';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  navMenuItem: {
    paddingLeft: "24px",
    paddingRight: "24px",
  },
});

class NavigationResources extends React.Component {
  constructor(props) {
    super(props);
    this.api = this.props.api;
    this.handleApiError = this.handleApiError.bind(this);

    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      open: false,
    };
  }

  handleApiError(e) {
    this.setState({
      error: e
    });
  }

  handleOnClick = () => {
    this.setState({ open: !this.state.open });
  };

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
    let isCurrentPage = path => path === window.location.pathname;

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
    const { classes } = this.props;

    return (
      <React.Fragment>
        <MenuItem
          className={classes.navMenuItem}
          button
          onClick={this.handleOnClick}>
          <ListItemIcon><ViewListIcon /></ListItemIcon>
          <ListItemText inset primary="Resources" />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </MenuItem>

        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <MenuList dense component="div" disablePadding>

            <NavigationResource name="Deployments" to="/deployments" />

            { this.menuItem("/authorities", "Authorities", <NavigateNextIcon />) }
            { this.menuItem("/deployments", "Deployments", <NavigateNextIcon />) }
            { this.menuItem("/namespaces", "Namespaces", <NavigateNextIcon />) }
            { this.menuItem("/pods", "Pods", <NavigateNextIcon />) }
            { this.menuItem("/replicationcontrollers", "Replication Controllers", <NavigateNextIcon />) }
          </MenuList>
        </Collapse>
      </React.Fragment>
    );
  }
}

NavigationResources.propTypes = {};

export default withContext(withStyles(styles, { withTheme: true })(NavigationResources));
