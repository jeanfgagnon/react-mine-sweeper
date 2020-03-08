import React, { Component, MouseEvent, ReactElement } from 'react';

import CellModel from '../Common/CellModel';

import './GameCell.css';

import flagImage from "../Assets/flag-cell.png";

type Props = {
  cellModel: CellModel;
  OnClick: (e: Event, index: number) => void;  
  OnRightClick: (e: Event, index: number) => void;  
};

export default class GameCell extends Component<Props> {

  constructor(props: Props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <div onClick={this.handleClick} onContextMenu={this.handleClick} className={'game-cell ' + this.props.cellModel.CssClass}>{this.cellContent()}</div>
    );
  }

  // event handlers

  handleClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    if (e.type === 'click') {
      this.props.OnClick(e.nativeEvent, this.props.cellModel.CellNo);
    }
    else { 
      this.props.OnRightClick(e.nativeEvent, this.props.cellModel.CellNo);
    }
  }


  // helpers

  cellContent = (): ReactElement => {
    if (this.props.cellModel.IsRedFlagVisible) {
      return <img src={flagImage} className='flag-img' alt='Flag' />
    }
    return <span>{this.props.cellModel.Text}</span>
  }
}