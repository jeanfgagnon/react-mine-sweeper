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
  elapsed: number,
  flagCount: number
};

export default class GameForm extends React.Component<Props, State> {
  private timerHandle: any = 0;
  
  constructor(props: Props) {
    super(props);
    this.state = { 
      elapsed: 0,
      flagCount: 0 
    };
    this.startGame = this.startGame.bind(this);
    this.setFlagCount = this.setFlagCount.bind(this);
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
        <GameHeader gameOption={this.props.gameOption} elapsed={this.state.elapsed} flagCount={this.state.flagCount} />
        <GameBoard gameOption={this.props.gameOption} SetFlagCount={this.setFlagCount} OnFirstClick={this.startGame} />
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

  setFlagCount = (nb: number): void => {
    this.setState({ flagCount: nb});
  }

  incrementElapsed(): void {
    this.setState(prevState => {
      return { elapsed: prevState.elapsed + 1 };
   });
  }

} // component