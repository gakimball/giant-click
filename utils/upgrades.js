export const AdTeamUpgrade = 'AdTeamUpgrade';
export const Recruiter = 'Recruiter';

export default {
  [AdTeamUpgrade]: {
    title: 'Ad Team',
    description: 'Generate revenue from non-subscribers',
    info: rank => `$1 per ${[10000, 5000, 2500, 1000, 500, 250, 100, 50, 25, 1][rank]} users`,
    cost: 50000
  },
  [Recruiter]: {
    title: 'Recruiter',
    description: 'Automatically add new staff to offices when money is available',
    info: rank => `${rank + 1} hire per second`,
    cost: 100000
  }
};
