import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import Statistics from '../components/statistics';
import Buildings from '../components/buildings';
import Upgrades from '../components/upgrades';

const Index = ({game}) => (
  <div className="container">
    <Statistics/>
    <button className="btn btn-primary" type="button" onClick={game.click}>
      #content
    </button>
    <Buildings/>
    <Upgrades/>
  </div>
);

Index.propTypes = {
  game: PropTypes.object.isRequired
};

export default inject('game')(observer(Index));
