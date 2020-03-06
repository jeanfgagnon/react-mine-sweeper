import React from 'react';

import GameHeader from './GameHeader';
import GameBoard from './GameBoard';
import GameConfig from './GameConfig';

import './GameForm.css';

import GameOption from '../Common/GameOption';

type Props = {
  gameOption: GameOption
};

export default class GameForm extends React.Component<Props> {
    
  componentDidMount(): void {
    console.log(JSON.stringify(this.props.gameOption));
  }
  
  render() {
    return (
    <div> 
      <div id='divGameForm' style={{width: (this.props.gameOption.NbCol * 27 + 10)}}>
        <GameHeader gameOption={this.props.gameOption} />
        <GameBoard gameOption={this.props.gameOption} />
      </div>
      
      <div id="divConfigPanel" className='gf-hidden'>
        <GameConfig></GameConfig>
      </div>
    </div>
  );

  } // render
} // component