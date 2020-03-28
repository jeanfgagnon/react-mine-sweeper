import React, { ReactElement } from 'react';

import GameOption from '../Common/GameOption';
import './GameHeader.css';

import smiley from '../Assets/smiley-smile.png';
import smileySad from '../Assets/smiley-sad.png';
//import gear from '../Assets/gear.png';

type Props = {
  gameOption: GameOption,
  running: boolean,
  gameOver: boolean,
  flagCount: number,
  elapsed: number,
  OnRestart: () => void,
  OnToggleConfig: () => void
};


export default class GameHeader extends React.Component<Props> {
  private timerHandler: any = 0;

  // life cycle plumbing

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
            <div className='gear-icon' onClick={this.gearClicked}></div>          
          </div>
        </div>

        <div className="container">
          <div className="start-pos"><div className="digit-box">{this.padNum(this.props.gameOption.NbBomb - this.props.flagCount)}</div></div>
          <div>
            <div className='smiley-button' title='Restart game' onClick={this.restart}>{this.getSmileyEL()}</div>
          </div>
          <div className="end-pos"><div className="digit-box">{this.padNum(this.props.elapsed)}</div></div>
        </div>

      </div>
    );
  }

  // event handlers

  private gearClicked = (): void => { 
    this.props.OnToggleConfig();
  }
  
  // Start another game (and possibly abort current one) 

  // clache direct la props?
  private restart = (): void => {
    this.props.OnRestart();
  }

  // helpers

  // private code

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