import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Buildings from '../components/buildings';
import Upgrades from '../components/upgrades';

const injector = ({game}) => ({
  money: game.money,
  audience: game.audience,
  subscribers: game.subscribers,
  throughput: game.throughput,
  earningRate: game.earningRate,
  click: () => game.click(),
  buildingUsage: game.buildingUsage
});

const Index = ({money, audience, subscribers, throughput, earningRate, click, buildingUsage}) => (
  <div className="container">
    <div className="row">
      <div className="col">
        <p><strong>Money:</strong> ${money.toLocaleString()}</p>
        <p><strong>Earning Rate:</strong> ${earningRate.toLocaleString()}</p>
        <p><strong>Audience:</strong> {audience}</p>
        <p><strong>Subscribers:</strong> {subscribers}</p>
        <p><strong>Throughput:</strong> {throughput}</p>
        <p><strong>Office Usage:</strong> {Math.ceil(buildingUsage * 100)}%</p>
        <button className="btn btn-primary" type="button" onClick={click}>
          #content
        </button>
        <Buildings/>
        <Upgrades/>
      </div>
    </div>
  </div>
);

Index.propTypes = {
  money: PropTypes.number.isRequired,
  earningRate: PropTypes.number.isRequired,
  audience: PropTypes.number.isRequired,
  subscribers: PropTypes.number.isRequired,
  throughput: PropTypes.number.isRequired,
  click: PropTypes.func.isRequired,
  buildingUsage: PropTypes.number.isRequired
};

export default inject(injector)(Index);
