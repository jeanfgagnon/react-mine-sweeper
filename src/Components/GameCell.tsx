import React from 'react';

import CellModel from '../Common/CellModel';

import './GameCell.css';

type Props = {
  cellModel: CellModel;
  OnClick: (e: Event, index: number) => void;  
};

export default class GameCell extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  render() {
    return (
      <div onClick={this.handleClick} className={'game-cell ' + this.props.cellModel.CssClass}></div>
    );
  }

  // event handlers

  handleClick(e: React.MouseEvent<HTMLElement>): void {
    e.preventDefault();
    this.props.OnClick(e.nativeEvent, this.props.cellModel.CellNo);
  }
}