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
  elapsed: number
};

export default class GameForm extends React.Component<Props, State> {
  private timerHandle: any = 0;
  
  constructor(props: Props) {
    super(props);
    this.state = { 
      elapsed: 0 
    };
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount(): void {

  }
  
  componentWillUnmount(): void {
    clearInterval(this.timerHandle);
  }

  render() {
    return (
    <div> 
      <div id='divGameForm' style={{width: (this.props.gameOption.NbCol * 27 + 10)}}>
        <GameHeader gameOption={this.props.gameOption} elapsed={this.state.elapsed} />
        <GameBoard gameOption={this.props.gameOption} OnFirstClick={this.startGame} />
      </div>
      
      <div id="divConfigPanel" className='gf-hidden'>
        <GameConfig></GameConfig>
      </div>
    </div>
  );

  } // render

  // event handlers

  startGame(): void {
    // start timer 
    this.setState({ elapsed: 0 });
    this.timerHandle = setInterval(() => this.incrementElapsed(), 1000); 
  }

  incrementElapsed(): void {
    this.setState({ elapsed: this.state.elapsed + 1 });
  }

} // component