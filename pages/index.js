import React from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import Buildings from '../components/buildings';

const injector = ({user}) => ({
  money: user.money,
  audience: user.audience,
  subscribers: user.subscribers,
  throughput: user.throughput,
  earningRate: user.earningRate,
  click: () => user.click()
});

const Index = ({money, audience, subscribers, throughput, earningRate, click}) => (
  <div className="container">
    <div className="row">
      <div className="col">
        <p><strong>Money:</strong> ${money.toLocaleString()}</p>
        <p><strong>Earning Rate:</strong> ${earningRate.toLocaleString()}</p>
        <p><strong>Audience:</strong> {audience}</p>
        <p><strong>Subscribers:</strong> {subscribers}</p>
        <p><strong>Throughput:</strong> {throughput}</p>
        <button className="btn btn-primary" type="button" onClick={click}>
          #content
        </button>
        <Buildings/>
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
  click: PropTypes.func.isRequired
};

export default inject(injector)(Index);
