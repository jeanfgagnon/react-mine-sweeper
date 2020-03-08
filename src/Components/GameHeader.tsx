import React from 'react';

import GameOption from '../Common/GameOption';
import './GameHeader.css';

type Props = {
  gameOption: GameOption,
  elapsed: number
};

export default class GameHeader extends React.Component<Props> {

  render() { 
    return (
      <div id='game-header'>
        <div className="interieur">
          <div className='start-pos'>
            React MineSweeper v1.0 - 
            Cols: {this.props.gameOption.NbCol} &nbsp; 
            Rows: {this.props.gameOption.NbRow} &nbsp; 
            Bombs: {this.props.gameOption.NbBomb} &nbsp; 
          </div>
          <div className='end-pos'>
            Gear spot
          </div>
        </div>
        {this.props.elapsed}
      </div>
    );
  }
}