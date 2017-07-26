import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Icon from '../../Icon';
import {_prettyTime} from './utils';

export default class Timezone extends Component {
  render() {
    const {time, user, params} = this.props;
    return (
      <div className="entry">
        <div className="row actions">
          <div className="action timestamp">{_prettyTime(time)}</div>
        </div>
        <div className="row contents">
          <div className="icon-box">
            <Icon user={user} />
          </div>
          <div className="contents-box">
            <table className="timezone">
              <tbody>
                {Object.keys(params).map(name => {
                  return <tr key={name}><th>{name}</th><td>{params[name].date}</td><td className="zone">{params[name].zone}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  static propTypes = {
    user: PropTypes.object.isRequired, // TODO: shape
    time: PropTypes.number.isRequired, // TODO: shape
    params: PropTypes.object.isRequired, // TODO: shape
  }
}
