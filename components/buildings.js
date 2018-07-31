import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import get from 'lodash/get';
import cls from 'classnames';
import {BUILDING_NAMES} from '../utils/constants';
import Tooltip from './tooltip';

class Buildings extends Component {
  state = {
    selectedOffice: this.props.game.offices[0].location
  }

  handleOfficeClick = location => {
    this.setState({
      selectedOffice: location
    });
  }

  render() {
    const {game} = this.props;
    const selectedOffice = game.offices.find(office => office.location === this.state.selectedOffice);

    return (
      <div>
        <div className="row">
          <div className="col col-lg-4">
            <p className="text-muted text-uppercase"><strong>Offices</strong></p>
            <Tooltip text="Build a new office to increase the number of staff you can hire.">
              <a href="#" onClick={() => game.buyOffice(1)}>
                + New Office (${game.getCostToBuild(1).toLocaleString()})
              </a>
            </Tooltip>
            <hr/>
            {toJS(game.offices).map(office => (
              <Fragment key={office.location}>
                <a
                  className={cls(`text-${office.location === selectedOffice.location ? 'primary' : 'secondary'}`)}
                  href="#"
                  onClick={() => this.handleOfficeClick(office.location)}
                >
                  {office.location}
                </a>
                <br/>
              </Fragment>
            ))}
          </div>
          <div className="col col-lg-8">
            <p className="text-muted text-uppercase"><strong>{selectedOffice.location}</strong></p>
            <Tooltip text="Upgrade the size of a building to fit more people inside it.">
              <a href="#" onClick={() => game.upgradeOffice(selectedOffice.location)}>
                &uarr; Upgrade to {BUILDING_NAMES[selectedOffice.level + 1]} (${game.getCostToUpgrade(selectedOffice.location).toLocaleString()})
              </a>
            </Tooltip>
            <br/>
            <Tooltip text="Hire more people to keep the content machine churning.">
              <a href="#" onClick={() => game.buyPerson(selectedOffice.location)}>
                + New Hire (${game.costToHire.toLocaleString()})
              </a>
            </Tooltip>
            <hr/>
            <ul className="list-unstyled">
              {get(toJS(game.peopleByOffice), selectedOffice.location, []).map(person => (
                <li key={person.name}>
                  <strong>{person.name}</strong>
                  <Tooltip text="An employee produces content equal to their level each second.">
                    <span> Lv. {person.level}</span>
                  </Tooltip>
                  {person.rare && ', rare'}
                  &nbsp;
                  <Tooltip text="Promote an employee, and they will produce more content.">
                    <a
                      href="#"
                      onClick={() => game.promotePerson(person.id)}
                    >
                      Promote (${game.getCostToPromote(person.id).toLocaleString()})
                    </a>
                  </Tooltip>
                </li>
              ))}
              <Tooltip text="An office has limited space for employees.">
                <li><em>{game.getEmptyBuildingSlots(selectedOffice.location)} slots left</em></li>
              </Tooltip>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

Buildings.propTypes = {
  game: PropTypes.object.isRequired
};

export default inject('game')(observer(Buildings));
