import React from 'react';

import CellModel from '../Common/CellModel';

import './GameCell.css';

type Props = {
  cellModel: CellModel;
};

export default class GameCell extends React.Component<Props> {

  render() {
    return (
      <div className={'game-cell ' + this.props.cellModel.CssClass}>.</div>
    );
  }
}