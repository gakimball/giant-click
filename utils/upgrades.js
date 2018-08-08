export const AdTeamUpgrade = 'AdTeamUpgrade';
export const Recruiter = 'Recruiter';
export const LawyerUpgrade = 'LawyerUpgrade';
export const MarketerUpgrade = 'MarketerUpgrade';

export default {
  [AdTeamUpgrade]: {
    title: 'Ad Team',
    description: 'Generate revenue from non-subscribers',
    info: rank => `$1 per ${[10000, 5000, 2500, 1000, 500, 250, 100, 50, 25, 1][rank]} users`,
    cost: 50000
  },
  [LawyerUpgrade]: {
    title: 'Lawyers',
    description: 'Reduce the cost of buying and upgrading buildings',
    info: rank => `${rank + 1}% discount`,
    cost: 1000000
  },
  [MarketerUpgrade]: {
    title: 'Marketers',
    description: 'Increase conversion rate for non-subscribers',
    info: rank => `${2.5 * (rank + 1)} percentage point increase`,
    cost: 1
  },
  // Not yet implemented
  [Recruiter]: {
    title: 'Recruiter',
    description: 'Automatically add new staff to offices when money is available',
    info: rank => `${rank + 1} hire per second`,
    cost: 100000
  }
};
