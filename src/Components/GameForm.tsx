import React from 'react';

import GameHeader from './GameHeader';
import GameBoard from './GameBoard';
import GameConfig from './GameConfig';

import './GameForm.css';

import GameOption from '../Common/GameOption';

type Props = {
  gameOption: GameOption
};

type State = {
  gameOver: boolean,
  running: boolean,
  flagCount: number
};

export default class GameForm extends React.Component<Props, State> {
  private timerHandle: any = 0;
  
  constructor(props: Props) {
    super(props);
    this.state = { 
      gameOver: false,
      running: false,
      flagCount: 0 
    };
    // this.startGame = this.startGame.bind(this);
    // this.setFlagCount = this.setFlagCount.bind(this);
  }

  componentDidMount(): void {

  }
  
  componentWillUnmount(): void {
  }

  render() {
    return (
    <div> 
      <div id='divGameForm' style={{width: (this.props.gameOption.NbCol * 27 + 10)}}>
        <GameHeader 
            gameOption={this.props.gameOption} 
            running={this.state.running}
            gameOver={this.state.gameOver}
            OnTimeout={this.stopGame}
            flagCount={this.state.flagCount} 
        />
        <GameBoard 
            gameOption={this.props.gameOption} 
            SetFlagCount={this.setFlagCount}
            OnFirstClick={this.startGame}
            OnBoom={this.onBoom}
        />
      </div>
      
      <div id="divConfigPanel" className='gf-hidden'>
        <GameConfig></GameConfig>
      </div>
    </div>
  );

  } // render

  // event handlers

  // we exploded ourself 
  private onBoom = (): void => {
    this.setState({ running: false, gameOver: true});
  }

  private startGame = (): void => {
    this.setState({ running: true });
  }

  private stopGame = (): void => {
    this.setState({ running: false });
  }

  private setFlagCount = (nb: number): void => {
    this.setState({ flagCount: nb});
  }

} // component