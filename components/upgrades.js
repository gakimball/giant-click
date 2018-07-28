import React from 'react';
import {observer, inject} from 'mobx-react';
import upgrades from '../utils/upgrades';

const Upgrades = ({user}) => (
  <div>
    <ul>
      {Object.entries(upgrades).map(([key, upgrade]) => (
        <li key={key}>
          <p><strong>{upgrade.title}:</strong> {upgrade.description}</p>
          <p><em>{upgrade.info(0)}</em></p>
        </li>
      ))}
    </ul>
  </div>
);

export default inject('user')(observer(Upgrades));
