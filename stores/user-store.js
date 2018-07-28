import {observable, computed, action, extendObservable, toJS} from 'mobx';
import randomFirstname from 'random-firstname';
import groupBy from 'lodash/groupBy';
import uuid from 'uuid/v4';
import {bind} from 'decko';
import {BUILDING_COST, PEOPLE_COST, PEOPLE_PROMOTION_COST, BUILDING_CAPACITIES} from '../utils/constants';

const SUBSCRIBER_VALUE = 5;

export default class UserStore {
  constructor(state) {
    extendObservable(this, state);
  }

  serialize() {
    return JSON.stringify(toJS(this));
  }

  deserialize() {
    // @TODO
  }

  /**
   * Game state
   * ----------
   *
   * Anything here should go into a save file.
   */

  // Player has been set
  @observable exists = false

  // Player name
  @observable name = ''

  // Player website name
  @observable website = ''

  // Cash on hand
  @observable money = 100000

  // Total audience
  @observable audience = 0

  // Total subscribers
  @observable subscribers = 0

  // Change a new audience member will subscribe
  @observable subscriberOdds = 0.5

  // Lifetime stats
  @observable lifetimeProduction = 0

  // Buildings
  @observable offices = []

  // Employees
  @observable people = []

  // Special effects
  @observable auras = []

  // Age of save in seconds (in-game days)
  @observable age = 0

  // Last tick (used to calculate delta when user returns to game after a period of time)
  lastTick = Date.now()

  /**
   * Player metrics
   * --------------
   */

  // Content produced per user click
  @computed get userThroughput() {
    return 1;
  }

  // Percentage of paid subscribers
  @computed get subscriberRatio() {
    return this.audience / this.subscribers;
  }

  // Content produced automatically every second
  @computed get throughput() {
    return this.people.reduce((count, person) => count + person.level, 0);
  }

  // Money made every second
  @computed get earningRate() {
    return this.subscribers * SUBSCRIBER_VALUE;
  }

  /**
   * Money
   * -----
   */

  @action addMoney(amount) {
    this.money += amount;
  }

  @action removeMoney(amount) {
    this.money -= amount;
  }

  @action generateRevenue() {
    this.addMoney(this.earningRate);
  }

  canAfford(amount) {
    return amount <= this.money;
  }

  /**
   * Audience
   * --------
   */

  @action addAudience(amount) {
    this.audience += amount;
  }

  @action addSubscribers(amount) {
    this.subscribers += amount;
  }

  @action increaseSubscriberOdds(amount) {
    this.subscriberOdds += amount;
  }

  /**
   * Offices
   * -------
   */

  @action.bound buyOffice(level, location) {
    const cost = this.getCostToBuild(level);

    if (this.canAfford(cost)) {
      this.removeMoney(cost);

      this.offices.push({
        level,
        location
      });
    }
  }

  @bind getCostToBuild(level) {
    return BUILDING_COST * level;
  }

  @action.bound upgradeOffice(location) {
    const office = this.offices.find(office => office.location === location);

    if (!office) {
      return;
    }

    const cost = this.getCostToUpgrade(location);

    if (this.canAfford(cost)) {
      this.removeMoney(cost);

      office.level += 1;
    }
  }

  @bind getCostToUpgrade(location) {
    const office = this.offices.find(office => office.location === location);

    if (!office) {
      return 0;
    }

    return this.getCostToBuild(office.level + 1);
  }

  @bind getEmptyBuildingSlots(location) {
    const office = this.offices.find(office => office.location === location);

    if (!office) {
      return 0;
    }

    return BUILDING_CAPACITIES[office.level] - this.getPeople(office.location).length;
  }

  buildingHasSpace(location) {
    return this.getEmptyBuildingSlots(location) > 0;
  }

  /**
   * People
   * ------
   */

  @action.bound buyPerson(office) {
    if (!this.buildingHasSpace(office)) {
      return;
    }

    const cost = this.costToHire;

    if (this.canAfford(cost)) {
      this.removeMoney(cost);

      this.people.push({
        id: uuid(),
        name: randomFirstname(),
        level: 1,
        output: 0,
        rare: false,
        office
      });
    }
  }

  @computed get costToHire() {
    return PEOPLE_COST;
  }

  @action.bound promotePerson(personId) {
    const person = this.people.find(person => person.id === personId);

    if (!person || person.level === 10) {
      return;
    }

    const cost = this.getCostToPromote(personId);

    if (this.canAfford(cost)) {
      this.removeMoney(cost);

      person.level += 1;
    }
  }

  @bind getCostToPromote(personId) {
    const person = this.people.find(person => person.id === personId);

    if (!person) {
      return;
    }

    return PEOPLE_PROMOTION_COST * person.level;
  }

  @computed get peopleByOffice() {
    return groupBy(toJS(this.people), 'office');
  }

  getPeople(office) {
    return this.people.filter(person => person.office === office);
  }

  /**
   * Game loop
   */

  // Generate subscribers and revenue based on employee throughput
  @action tick() {
    const {throughput} = this;

    // Content creates audience
    this.addAudience(throughput);
    this.addSubscribers(Math.ceil(throughput * this.subscriberOdds));

    // Log for the records
    this.people.forEach(person => {
      person.output += person.level;
    });

    // Audience creates money
    this.generateRevenue();

    // Advance time
    this.age += 1;
    this.lastTick = Date.now();
  }

  // Simulate a game over the period of time since the user last saved
  @action catchUp() {
    const delta = Math.floor((Date.now() - this.lastTick) / 1000);

    for (let i = 0; i < delta; i++) {
      this.tick();
    }
  }

  /**
   * Player actions
   */

  // Generate subscribers and revenue based on player throughput
  @action click() {
    const {userThroughput} = this;

    // Content creates audience
    this.addAudience(userThroughput);
    this.addSubscribers(userThroughput);
  }
}
