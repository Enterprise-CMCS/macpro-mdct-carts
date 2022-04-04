import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

const PageInfo = ({ lastSaved, name, status, formYear }) => (
  <div className="page-info">
    <div className="edit-info">
      {status ?? 'draft'}
      {lastSaved.isValid() && ` | Last Edit: ${lastSaved.format('M/D/YYYY')}`}
    </div>
    <h1>
      {name} CARTS{} FY{formYear}
    </h1>
  </div>
);
PageInfo.propTypes = {
  lastSaved: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  formYear: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  lastSaved: moment(state.save.lastSave),
  status: state.reportStatus.status,
  formYear: state.global.formYear,
});

export default connect(mapStateToProps)(PageInfo);
