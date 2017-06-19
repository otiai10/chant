import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {useStamp} from '../../actions/remote';

@connect(null, {
  useStamp,
})
class Stamp extends Component {
  render() {
    return (
      <div>
        <button className="button stamp" onClick={this.onClick.bind(this)}>{this.props.text}</button>
      </div>
    );
  }
  onClick() {
    this.props.useStamp(this.props);
  }
  static propTypes = {
    text: PropTypes.string.isRequired,
    useStamp: PropTypes.func.isRequired,
  }
}

@connect(({stamps}) => ({stamps}))
export default class StampsInput extends Component {
  render() {
    const {stamps} = this.props;
    return (
      <div className="row stamps">
        {stamps.map(stamp => <Stamp key={stamp.text} {...stamp} />)}
      </div>
    );
  }
  static propTypes = {
    stamps: PropTypes.array.isRequired,
  }
}
