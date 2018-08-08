import {observable, computed, action, extendObservable, toJS} from 'mobx';
import randomFirstname from 'random-firstname';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import times from 'lodash/times';
import uuid from 'uuid/v4';
import {bind} from 'decko';
import {BUILDING_COST, PEOPLE_COST, PEOPLE_PROMOTION_COST, BUILDING_CAPACITIES, BUILDING_LOCATIONS, AD_RATE} from '../utils/constants';
import upgrades, {AdTeamUpgrade, LawyerUpgrade, MarketerUpgrade, MentalQuicknessUpgrade, CloningUpgrade} from '../utils/upgrades';

const SUBSCRIBER_VALUE = 5;

export default class UserStore {
  constructor(state) {
    extendObservable(this, state);

    this.createGame();
  }

  serialize() {
    return JSON.stringify(toJS(this));
  }

  deserialize() {
    // @TODO
  }

  @action.bound createGame() {
    this.exists = true;
    this.name = 'Geoff';
    this.website = 'grantclick.biz';
    this.money = 100000;
    const office = this.addOffice(0);
    this.addPerson(office.location, {isPlayer: true});
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
  @observable money = 0

  // Total audience
  @observable audience = 0

  // Total subscribers
  @observable subscribers = 0

  // Change a new audience member will subscribe
  @computed get subscriberOdds() {
    const rank = this.upgrades[MarketerUpgrade];

    return 0.5 + (0.025 * (rank + 1));
  }

  // Lifetime stats
  @observable lifetimeProduction = 0

  // Buildings
  @observable offices = []

  // Employees
  @observable people = []

  // Age of save in seconds (in-game days)
  @observable age = 0

  // Upgrades
  // -1 means it hasn't been purchased yet
  // 0-9 correspond to rank
  @observable upgrades = mapValues(upgrades, () => -1)

  // Last tick (used to calculate delta when user returns to game after a period of time)
  lastTick = Date.now()

  /**
   * Player metrics
   * --------------
   */

  // Content produced per user click
  @computed get userThroughput() {
    const rank = this.upgrades[MentalQuicknessUpgrade];

    // Base rank is -1, so the default throughput is 1
    return 2 + rank;
  }

  @computed get userClickRate() {
    const rank = this.upgrades[CloningUpgrade];

    // Base rank is -1, so the default click count is 1
    return 2 + rank;
  }

  // Percentage of paid subscribers
  @computed get subscriberRatio() {
    return this.audience / this.subscribers;
  }

  // Content produced automatically every second
  @computed get throughput() {
    return this.people.reduce(
      (count, person) => person.isPlayer ? count : (count + person.level),
      0,
    );
  }

  @computed get subscriberRevenue() {
    return this.subscribers * SUBSCRIBER_VALUE;
  }

  @computed get advertisingRevenue() {
    const rank = this.upgrades[AdTeamUpgrade];

    if (rank < 0) {
      return 0;
    }

    const nonPayingAudience = this.audience - this.subscribers;

    return Math.floor(nonPayingAudience / AD_RATE[rank]);
  }

  // Money made every second
  @computed get earningRate() {
    return this.subscriberRevenue + this.advertisingRevenue;
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

  @action addOffice(level) {
    this.offices.push({
      level,
      location: BUILDING_LOCATIONS[this.offices.length]
    });

    return this.offices[this.offices.length - 1];
  }

  @action.bound buyOffice(level) {
    const cost = this.getCostToBuild(level);

    if (this.canAfford(cost)) {
      this.removeMoney(cost);
      this.addOffice(level);
    }
  }

  @bind getCostToBuild(level) {
    const rank = this.upgrades[LawyerUpgrade];
    const costModifier = 1 - (0.01 * (rank + 1));

    return Math.floor(BUILDING_COST * level * costModifier);
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

  @computed get buildingUsage() {
    const totalSize = this.offices.reduce(
      (total, office) => total + BUILDING_CAPACITIES[office.level],
      0,
    );

    return this.people.length / totalSize;
  }

  /**
   * People
   * ------
   */

  @action addPerson(office, {isPlayer = false} = {}) {
    this.people.push({
      id: uuid(),
      name: isPlayer ? this.name : randomFirstname(),
      level: 1,
      output: 0,
      rare: false,
      isPlayer,
      office
    });
  }

  @action.bound buyPerson(office) {
    if (!this.buildingHasSpace(office)) {
      return;
    }

    const cost = this.costToHire;

    if (this.canAfford(cost)) {
      this.removeMoney(cost);
      this.addPerson(office);
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
   * Upgrades
   */

  buyUpgrade(type) {
    if (!(type in this.upgrades)) {
      return;
    }

    const cost = this.getCostToBuyUpgrade(type);

    if (this.canAfford(cost)) {
      this.removeMoney(cost);
      this.upgrades[type] += 1;
    }
  }

  getCostToBuyUpgrade(type) {
    if (!(type in this.upgrades)) {
      return 0;
    }

    return (this.upgrades[type] + 2) * upgrades[type].cost;
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
  @action.bound click() {
    const {userThroughput} = this;

    times(this.userClickRate, () => {
      // Content creates audience
      this.addAudience(userThroughput);
      this.addSubscribers(userThroughput);
    });
  }
}
