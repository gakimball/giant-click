import {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';

const injector = ({user}) => ({
  tick: () => user.tick()
});

class Ticker extends Component {
  static propTypes = {
    tick: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.interval = setInterval(this.props.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return null;
  }
}

export default inject(injector)(Ticker);
