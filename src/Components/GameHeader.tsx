import React, { ReactElement } from 'react';

import GameOption from '../Common/GameOption';
import './GameHeader.css';

import smiley from '../Assets/smiley-smile.png';
import smileySad from '../Assets/smiley-sad.png';

type Props = {
  gameOption: GameOption,
  running: boolean,
  gameOver: boolean,
  flagCount: number,
  OnTimeout: () => void
};

type State = {
  elapsed: number;
};

export default class GameHeader extends React.Component<Props, State> {
  private timerHandler: any = 0;

  // life cycle plumbing

  constructor(props: Props) {
    super(props);
    this.state = {
      elapsed: 0
    }
  }

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

        <div className="container">
          <div className="start-pos"><div className="digit-box">{this.padNum(this.props.gameOption.NbBomb - this.props.flagCount)}</div></div>
          <div>
            <div className='smiley-button' onClick={this.restart}>{this.getSmileyEL()}</div>
          </div>
          <div className="end-pos"><div className="digit-box">{this.padNum(this.state.elapsed)}</div></div>
        </div>

      </div>
    );
  }

  componentDidMount() {
    this.checkTimer();
  }

  componentDidUpdate() {
    this.checkTimer();
  }

  componentWillUnmount() {
    clearInterval(this.timerHandler);
  }

  // event handlers

  // Start another game (and possibly abort current one)
  private restart(): void {
    clearInterval(this.timerHandler);
  }

  // helpers

  // private code

  private checkTimer(): void {
    if (this.props.running) {
      if (this.timerHandler === 0) {
        this.timerHandler = setInterval(() => { this.incrementElapsed() }, 1000);
      }
    }
    else {
      clearInterval(this.timerHandler);
    }
  }

  incrementElapsed(): void {
    if (this.state.elapsed < this.props.gameOption.MaxSec) {
      this.setState(prevState => {
        return { elapsed: prevState.elapsed + 1 };
      });
    }
    else {
      // clearInterval(this.timerHandler); shoul be cleared after parent state's change
      this.props.OnTimeout();
    }
  }

  private getSmileyEL = (): ReactElement => {
    if (this.props.gameOver) {
      return (<img id="img-smiley" src={smileySad} alt='Sad Smiley' />);
    }
    else {
      return (<img id="img-smiley" src={smiley} alt='Smiley' />);
    }
  }
  
  private padNum = (num: number): string => {
    let rv;
    if (num < 10) {
      rv = '00' + num.toString();
    }
    else if (num < 100) {
      rv = '0' + num.toString();
    }
    else { 
      rv = num.toString();
    }

    return rv;
  }

} // component