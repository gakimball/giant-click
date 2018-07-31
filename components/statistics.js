import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';

const Statistics = ({game}) => (
  <div className="row">
    <div className="col col-lg-3">
      <p className="text-muted text-lowercase">Money</p>
      <p className="display-4">${game.money.toLocaleString()}</p>
    </div>
    <div className="col col-lg-3">
      <p className="text-muted text-lowercase">Revenue Rate</p>
      <p className="display-4">${game.earningRate.toLocaleString()}</p>
    </div>
    <div className="col col-lg-2">
      <p className="text-muted text-lowercase">Strength</p>
      <p>
        <span className="display-4">{game.userThroughput}</span>/click
      </p>
    </div>
    <div className="col col-lg-2">
      <p className="text-muted text-lowercase">Audience</p>
      <p className="display-4">{game.audience}</p>
    </div>
    <div className="col col-lg-2">
      <p className="text-muted text-lowercase">Subscribers</p>
      <p className="display-4">{game.subscribers}</p>
    </div>
  </div>
);

Statistics.propTypes = {
  game: PropTypes.object.isRequired
};

export default inject('game')(observer(Statistics));
