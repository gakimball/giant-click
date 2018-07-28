import {action, decorate} from 'mobx';

export default class GameStore {
  constructor(user) {
    this.user = user;
  }

  tick() {
    const {user} = this;

    // Generate content
    const newContent = user.people.reduce((count, person) => count + person.level, 0);

    // Content creates audience
    this.addAudience(newContent);

    // Audience creates money
    this.generateRevenue();
  }
}

decorate(GameStore, {
  tick: action
});
