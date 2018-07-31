import React, {Children, Component, Fragment} from 'react';
import DocumentEvents from 'react-document-events';
import PropTypes from 'prop-types';

export default class Tooltip extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    text: PropTypes.string
  }

  static defaultProps = {
    text: ''
  }

  state = {
    tooltipVisible: false,
    tooltipPosition: {
      x: 0,
      y: 0
    }
  }

  handleMouseEnter = () => {
    this.setState({
      tooltipVisible: true
    });
  }

  handleMouseLeave = () => {
    this.setState({
      tooltipVisible: false
    });
  }

  handleMouseMove = event => {
    this.setState({
      tooltipPosition: {
        x: event.clientX,
        y: event.clientY
      }
    });
  }

  render() {
    const {children, text} = this.props;
    const {tooltipVisible, tooltipPosition} = this.state;
    const child = Children.only(children);

    return (
      <Fragment>
        <child.type {...child.props} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}/>
        {tooltipVisible && (
          <Fragment>
            <DocumentEvents onMouseMove={this.handleMouseMove}/>
            <div className="Tooltip card" style={{left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px`}}>
              <div className="card-body">
                <p className="Tooltip-text small">{text}</p>
              </div>
            </div>
          </Fragment>
        )}
        <style jsx>
          {`
            .Tooltip {
              position: fixed;
              z-index: 10000;
              width: 250px;
              pointer-events: none;
            }

            .Tooltip-text {
              margin-bottom: 0;
            }
          `}
        </style>
      </Fragment>
    );
  }
}
