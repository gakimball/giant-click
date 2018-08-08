import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import Tooltip from './tooltip';

const Statistics = ({game}) => (
  <div className="row">
    <div className="col col-lg-3">
      <p className="text-muted text-lowercase">Money</p>
      <Tooltip text="Make this number as high as possible.">
        <p className="display-4">${game.formattedMoney}</p>
      </Tooltip>
    </div>
    <div className="col col-lg-3">
      <p className="text-muted text-lowercase">Revenue Rate</p>
      <Tooltip text="Amount of money you make per second. Increase this by getting more subscribers, or buying an ad deal.">
        <p className="display-4">${game.earningRate.toLocaleString()}</p>
      </Tooltip>
    </div>
    <div className="col col-lg-2">
      <p className="text-muted text-lowercase">Strength</p>
      <Tooltip text="The amount of content you produce per click. Content brings in subscribers.">
        <p>
          <span className="display-4">{game.userThroughput}</span>/click
        </p>
      </Tooltip>
    </div>
    <div className="col col-lg-2">
      <p className="text-muted text-lowercase">Audience</p>
      <Tooltip text="Total audience. Non-paying users can be monetized through an ad deal.">
        <p className="display-4">{game.audience}</p>
      </Tooltip>
    </div>
    <div className="col col-lg-2">
      <p className="text-muted text-lowercase">Subscribers</p>
      <Tooltip text="Subscriber count. Each paying user generates $5 per second.">
        <p className="display-4">{game.subscribers}</p>
      </Tooltip>
    </div>
  </div>
);

Statistics.propTypes = {
  game: PropTypes.object.isRequired
};

export default inject('game')(observer(Statistics));
