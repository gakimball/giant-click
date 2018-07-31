import React from 'react';
import PropTypes from 'prop-types';
import {toJS} from 'mobx';
import {inject} from 'mobx-react';
import get from 'lodash/get';
import {BUILDING_NAMES} from '../utils/constants';

const injector = ({game}) => ({
  offices: toJS(game.offices),
  peopleGroups: game.peopleByOffice,
  buyOffice: game.buyOffice,
  buyPerson: game.buyPerson,
  promotePerson: game.promotePerson,
  getCostToPromote: game.getCostToPromote,
  getCostToBuild: game.getCostToBuild,
  costToHire: game.costToHire,
  upgradeOffice: game.upgradeOffice,
  getCostToUpgrade: game.getCostToUpgrade,
  getEmptyBuildingSlots: game.getEmptyBuildingSlots
});

const Buildings = ({offices, peopleGroups, buyOffice, buyPerson, promotePerson, getCostToPromote, getCostToBuild, costToHire, upgradeOffice, getCostToUpgrade, getEmptyBuildingSlots}) => (
  <div>
    <p><strong>Offices:</strong></p>
    {offices.map(office => (
      <div key={office.location}>
        <p><strong>{office.location}</strong> ({BUILDING_NAMES[office.level]})</p>
        <button className="btn btn-secondary btn-sm" type="button" onClick={() => upgradeOffice(office.location)}>
          Upgrade (${getCostToUpgrade(office.location).toLocaleString()})
        </button>
        <ul>
          {get(peopleGroups, office.location, []).map(person => (
            <li key={person.name}>
              <strong>{person.name}</strong> Lv. {person.level}{person.rare && ', rare'}
              <button className="btn btn-secondary btn-sm" type="button" onClick={() => promotePerson(person.id)}>
                Promote (${getCostToPromote(person.id).toLocaleString()})
              </button>
            </li>
          ))}
          <li><em>{getEmptyBuildingSlots(office.location)} slots left</em></li>
          <li>
            <button className="btn btn-secondary btn-sm" type="button" onClick={() => buyPerson(office.location)}>
              New Hire (${costToHire.toLocaleString()})
            </button>
          </li>
        </ul>
      </div>
    ))}
    <button className="btn btn-primary" type="button" onClick={() => buyOffice(1)}>
      New Office (${getCostToBuild(1).toLocaleString()})
    </button>
  </div>
);

Buildings.propTypes = {
  offices: PropTypes.arrayOf(PropTypes.object).isRequired,
  peopleGroups: PropTypes.object.isRequired,
  buyOffice: PropTypes.func.isRequired,
  buyPerson: PropTypes.func.isRequired,
  promotePerson: PropTypes.func.isRequired,
  getCostToPromote: PropTypes.func.isRequired,
  getCostToBuild: PropTypes.func.isRequired,
  costToHire: PropTypes.number.isRequired,
  upgradeOffice: PropTypes.func.isRequired,
  getCostToUpgrade: PropTypes.func.isRequired,
  getEmptyBuildingSlots: PropTypes.func.isRequired
};

export default inject(injector)(Buildings);
