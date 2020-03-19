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
  flagCount: number,
  restart: boolean
};

export default class GameForm extends React.Component<Props, State> {
  private gameFormRef: React.RefObject<HTMLDivElement>;
  private configPanelRef: React.RefObject<HTMLDivElement>;
  private timerHandle: any = 0;
  private configStyle: object;

  constructor(props: Props) {
    super(props);
    this.state = {
      gameOver: false,
      running: false,
      flagCount: 0,
      restart: false
    };
    this.configStyle = {
      display: 'none'
    };
    this.gameFormRef = React.createRef();
    this.configPanelRef = React.createRef();
  }

  componentDidMount = (): void => {
    if (this.gameFormRef.current) {
      const gameFormRect: DOMRect = this.gameFormRef.current.getBoundingClientRect();
      console.log('LE RECT %s', JSON.stringify(gameFormRect));
      this.configStyle = {
        top: (gameFormRect.top + 70) + 'px',
        left: (gameFormRect.right /*- configPanelSize.width*/) + 'px'
      }
    }
  }

  componentWillUnmount(): void {
  }

  render() {
    return (
      <div>
        <div id='divGameForm' ref={this.gameFormRef} style={{ width: (this.props.gameOption.NbCol * 27 + 10) }}>
          <GameHeader
            gameOption={this.props.gameOption}
            running={this.state.running}
            gameOver={this.state.gameOver}
            OnTimeout={this.stopGame}
            OnRestart={this.restartGame}
            OnConfig={this.toggleConfig}
            flagCount={this.state.flagCount}
          />
          <GameBoard
            gameOption={this.props.gameOption}
            SetFlagCount={this.setFlagCount}
            gameOver={this.state.gameOver}
            OnFirstClick={this.startGame}
            restart={this.state.restart}
            OnBoom={this.onBoom}
          />
        </div>

        <div id="divConfigPanel" style={this.configStyle}>
          <GameConfig></GameConfig>
        </div>
      </div>
    );

  } // render

  // event handlers

  // we exploded ourself 
  private onBoom = (): void => {
    this.setState({ running: false, gameOver: true });
  }

  private startGame = (): void => {
    this.setState({ running: true, restart: false });
  }

  private stopGame = (): void => {
    this.setState({ running: false });
  }

  private setFlagCount = (nb: number): void => {
    this.setState({ flagCount: nb });
  }

  private restartGame = (): void => {
    this.setState({
      gameOver: false,
      running: false,
      flagCount: 0,
      restart: true
    });
  }

  private toggleConfig = (): void => {
    console.log('toggle-config-tabbb');
  }
  
} // component