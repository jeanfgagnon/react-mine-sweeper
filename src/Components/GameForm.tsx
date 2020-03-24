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
  restart: boolean,
  animClass: string;
};

export default class GameForm extends React.Component<Props, State> {
  private gameFormRef: React.RefObject<HTMLDivElement>;
  private configPanelRef: React.RefObject<HTMLDivElement>;

  // life cycle plumbing

  constructor(props: Props) {
    super(props);
    this.state = {
      gameOver: false,
      running: false,
      flagCount: 0,
      restart: false,
      animClass: ''
    };

    this.gameFormRef = React.createRef();
    this.configPanelRef = React.createRef();
  }

  componentDidMount = (): void => {
    this.positionConfig();
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
        {/* <div className={`box ${isBoxVisible ? "" : "hidden"`}}> */}

        <div id="divConfigPanel" ref={this.configPanelRef} className={this.getConfigClass()} >
          <GameConfig
            gameOption={this.props.gameOption}
            OnChange={this.optionChanged}
          />
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
    let newAnimClass = '';
    if (this.state.animClass === '' || this.state.animClass == 'close') {
      newAnimClass = 'open'
    }
    else {
      newAnimClass = 'close';
    }

    this.setState({
      animClass: newAnimClass
    });
  }

  private optionChanged(go: GameOption): void {

  }

  // helpers

  private getConfigClass(): string {
    let rv = 'divConfigPanel';

    rv += ' ' + this.state.animClass;

    return rv;
  }

  // private code

  private positionConfig(): void {
    if (this.gameFormRef.current && this.configPanelRef.current) {
      const gameFormRect: DOMRect = this.gameFormRef.current.getBoundingClientRect();
      const configPanelRect: DOMRect = this.configPanelRef.current.getBoundingClientRect();
      
      this.configPanelRef.current.style.setProperty('top', (gameFormRect.top + 30) + 'px');
      this.configPanelRef.current.style.setProperty('left', (gameFormRect.right - configPanelRect.width) + 'px');
      this.configPanelRef.current.style.setProperty('visibility', 'visible')
    }
  }

} // component
