import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {observer, inject} from 'mobx-react';
import upgrades from '../utils/upgrades';

const Upgrades = ({game}) => (
  <div>
    <p className="text-muted text-uppercase"><strong>Upgrades</strong></p>
    <ul className="list-unstyled">
      {Object.entries(upgrades).map(([key, upgrade]) => (
        <li key={key} className="Upgrades-item">
          <p><strong>{upgrade.title}:</strong></p>
          <p>{upgrade.description}</p>
          {game.upgrades[key] < 0 && (
            <p className="small">
              <strong>Next Rank: </strong>
              {upgrade.info(0)}
              &nbsp;
              <a href="#" onClick={() => game.buyUpgrade(key)}>Buy Rank {game.upgrades[key] + 2} (${game.getCostToBuyUpgrade(key).toLocaleString()})</a>
            </p>
          )}
          {game.upgrades[key] >= 0 && (
            <Fragment>
              <p className="small">
                <strong>Current Rank:</strong> {upgrade.info(game.upgrades[key])}
                {game.upgrades[key] < 9 && (
                  <Fragment>
                    <br/>
                    <span className="text-muted">
                      <strong>Next Rank: </strong>
                      {upgrade.info(game.upgrades[key] + 1)}
                      &nbsp;
                      <a href="#" onClick={() => game.buyUpgrade(key)}>Buy Rank {game.upgrades[key] + 2} (${game.getCostToBuyUpgrade(key).toLocaleString()})</a>
                    </span>
                  </Fragment>
                )}
              </p>
            </Fragment>
          )}
        </li>
      ))}
    </ul>
    <style jsx>
      {`
        .Upgrades-item {
          border-bottom: 1px solid #ddd;
          margin-bottom: 10px;
        }
      `}
    </style>
  </div>
);

Upgrades.propTypes = {
  game: PropTypes.object.isRequired
};

export default inject('game')(observer(Upgrades));
