import React from 'react';

import GameHeader from './GameHeader';
import GameBoard from './GameBoard';
import GameConfig from './GameConfig';

import './GameForm.css';

import GameOption from '../Common/GameOption';
import CellModel from '../Common/CellModel';

type Props = {
  gameOption: GameOption
};

type State = {
  gameOver: boolean,
  running: boolean,
  flagCount: number,
  restart: boolean,
  animClass: string;
  gameOption: GameOption;
};

export default class GameForm extends React.Component<Props, State> {
  private gameFormRef: React.RefObject<HTMLDivElement>;
  private configPanelRef: React.RefObject<HTMLDivElement>;
  private board: CellModel[] = [];
  // life cycle plumbing

  constructor(props: Props) {
    super(props);
    this.state = {
      gameOver: false,
      running: false,
      flagCount: 0,
      restart: false,
      animClass: '',
      gameOption: Object.assign({}, this.props.gameOption)
    };

    this.initBoard(this.props.gameOption.NbRow, this.props.gameOption.NbCol);

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
        <div id='divGameForm' ref={this.gameFormRef} style={{ width: (this.state.gameOption.NbCol * 27 + 10) }}>
          <GameHeader
            gameOption={this.state.gameOption}
            running={this.state.running}
            gameOver={this.state.gameOver}
            OnTimeout={this.stopGame}
            OnRestart={this.restartGame}
            OnConfig={this.toggleConfig}
            flagCount={this.state.flagCount}
          />
          <GameBoard
            gameOption={this.state.gameOption}
            SetFlagCount={this.setFlagCount}
            gameOver={this.state.gameOver}
            OnFirstClick={this.startGame}
            restart={this.state.restart}
            OnBoom={this.onBoom}
            board={this.board}
          />
        </div>

        <div id="divConfigPanel" ref={this.configPanelRef} className={this.state.animClass} >
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
    this.initBoard(this.state.gameOption.NbRow, this.state.gameOption.NbCol);
    this.setState({
      gameOver: false,
      running: false,
      flagCount: 0,
      restart: true
    });
  }

  private toggleConfig = (): void => {
    let newAnimClass = '';
    if (this.state.animClass === '' || this.state.animClass === 'close') {
      newAnimClass = 'open'
    }
    else {
      newAnimClass = 'close';
    }

    this.setState({
      animClass: newAnimClass
    });
  }

  private optionChanged = (go: GameOption): void => {
    this.initBoard(go.NbRow, go.NbCol);
    this.setState({
      gameOption: go,
      restart: true,
      running: false, 
      gameOver: false
    });
  }

  // helpers

  // private code

  // create board cells
  private initBoard(nbRow: number, nbCol: number): void {
    this.board = [];
    let index = 0;
    for (let rowNo = 0; rowNo < nbRow; rowNo++) {
      for (let colNo = 0; colNo < nbCol; colNo++) {
        const cell = this.createCellModel(index, rowNo, colNo);
        this.board.push(cell);
        index++;
      }
    }
  } // initBoard

  // create and initialize one board cell
  private createCellModel(index: number, rowNo: number, colNo: number): CellModel {
    const cell = new CellModel();

    cell.CellId = `cell_${rowNo + 1}_${colNo + 1}`;
    cell.CellNo = index;
    cell.IsRedFlagVisible = false;
    cell.IsBomb = false;
    cell.IsCleared = false;
    cell.Text = '';
    cell.CssClass = 'cellUnclick'

    return cell;
  } // createCellModel

  private positionConfig(): void {
    if (this.gameFormRef.current && this.configPanelRef.current) {
      const gameFormRect: DOMRect = this.gameFormRef.current.getBoundingClientRect();
      const configPanelRect: DOMRect = this.configPanelRef.current.getBoundingClientRect();

      this.configPanelRef.current.style.setProperty('top', (gameFormRect.top + 30) + 'px');
      this.configPanelRef.current.style.setProperty('left', (gameFormRect.right - configPanelRect.width) + 'px');
      this.configPanelRef.current.style.setProperty('visibility', 'visible');
    }
  }

} // component
