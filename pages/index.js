import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import Statistics from '../components/statistics';
import Buildings from '../components/buildings';
import Upgrades from '../components/upgrades';

const Index = ({game}) => (
  <div className="container">
    <Statistics/>
    <div className="row">
      <div className="col col-lg-6">
        <Buildings/>
      </div>
      <div className="col col-lg-6">
        <button className="btn btn-primary" type="button" onClick={game.click}>
          #content
        </button>
        <Upgrades/>
      </div>
    </div>
  </div>
);

Index.propTypes = {
  game: PropTypes.object.isRequired
};

export default inject('game')(observer(Index));
