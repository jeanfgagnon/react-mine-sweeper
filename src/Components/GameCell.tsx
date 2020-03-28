import React, { Component, MouseEvent, ReactElement } from 'react';

import CellModel from '../Common/CellModel';

import './GameCell.css';

import flagImage from "../Assets/flag-cell.png";

type Props = {
  cellModel: CellModel;
  OnClick: (index: number, isRightClick: boolean) => void;  
};

export default class GameCell extends Component<Props> {

  // life cycle plumbing  

  constructor(props: Props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <div onClick={this.handleClick} 
           onContextMenu={this.handleClick} 
           style={this.props.cellModel.CellStyle}
           className={'game-cell ' + this.props.cellModel.CssClass}
      >{this.cellContent()}</div>
    );
  }

  // event handlers

  handleClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    this.props.OnClick(this.props.cellModel.CellNo, e.type !== 'click');
  }

  // helpers

  cellContent = (): ReactElement => {
    if (this.props.cellModel.IsRedFlagVisible) {
      return <img src={flagImage} className='flag-img' alt='Flag' />
    }
    else {
      return <span>{this.props.cellModel.Text}</span>
    }
  }
}