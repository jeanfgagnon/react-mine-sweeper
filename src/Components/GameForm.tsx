import React from 'react';

import GameHeader from './GameHeader';
import GameBoard from './GameBoard';
import GameConfig from './GameConfig';

import './GameForm.css';

import GameOption from '../Common/GameOption';
import CellModel from '../Common/CellModel';
import CellCoords from '../Common/CellCoords';

type Props = {
  gameOption: GameOption
};

type State = {
  gameOver: boolean,
  running: boolean,
  flagCount: number,
  animClass: string;
  board: CellModel[];
  elapsed: number;
  gameOption: GameOption;
};

export default class GameForm extends React.Component<Props, State> {
  private gameFormRef: React.RefObject<HTMLDivElement>;
  private configPanelRef: React.RefObject<HTMLDivElement>;
  private board: CellModel[] = [];
  private azimuth = ['ne', 'n', 'nw', 'w', 'e', 'sw', 's', 'se'];
  private timerHandler: any = 0;

  // life cycle plumbing

  constructor(props: Props) {
    super(props);

    this.initBoard(this.props.gameOption.NbRow, this.props.gameOption.NbCol);
    
    this.state = {
      gameOver: false,
      running: false,
      flagCount: 0,
      animClass: '',
      board: this.board,
      elapsed: 0,
      gameOption: Object.assign({}, this.props.gameOption)
    };

    this.gameFormRef = React.createRef();
    this.configPanelRef = React.createRef();
  }

  render() {
    return (
      <div>
        <div id='divGameForm' ref={this.gameFormRef} style={{ width: (this.state.gameOption.NbCol * 27 + 10) }}>
          <GameHeader
            gameOption={this.state.gameOption}
            running={this.state.running}
            gameOver={this.state.gameOver}
            OnRestart={this.restartGame}
            elapsed={this.state.elapsed}
            OnToggleConfig={this.toggleConfig}
            flagCount={this.state.flagCount}
          />
          <GameBoard
            gameOption={this.state.gameOption}
            board={this.state.board}
            OnClick={this.cellClicked}
          />
        </div>

        <div id="divConfigPanel" ref={this.configPanelRef} className={this.state.animClass} >
          <GameConfig
            gameOption={this.state.gameOption}
            OnChange={this.optionChanged}
          />
        </div>
      </div>
    );

  } // render

  componentDidMount = (): void => {
    this.positionConfig();
  }

  componentDidUpdate = (): void => {
    this.positionConfig();
  }

  componentWillUnmount = (): void => {
    clearInterval(this.timerHandler);
  }

  // event handlers

  private cellClicked = (index: number, isRightClick: boolean): void => {
    this.board = [...this.state.board];
    if (isRightClick) {
      this.cellRightClick(index);
    }
    else {
      this.cellLeftClick(index);
    }
    this.setState({ board: this.board });
  }

  // we exploded ourself 
  private onBoom = (): void => {
    this.setState({ 
      running: false, 
      gameOver: true });
  }

  private startGame = (): void => {
    this.setState({ 
      running: true 
    });
  }

  private stopGame = (): void => {
    clearInterval(this.timerHandler);
    this.setState({ 
      running: false,
      gameOver: true
    });
  }

  private setFlagCount = (nb: number): void => {
    this.setState({ 
      flagCount: nb 
    });
  }

  private restartGame = (): void => {
    clearInterval(this.timerHandler);
    this.timerHandler = 0;
    this.initBoard(this.state.gameOption.NbRow, this.state.gameOption.NbCol);
    this.setState({
      gameOver: false,
      running: false,
      flagCount: 0,
      elapsed: 0,
      board: this.board
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
    clearInterval(this.timerHandler);
    this.timerHandler = 0;
    this.setState({
      gameOption: go,
      running: false, 
      gameOver: false,
      elapsed: 0,
      board: this.board
    });
  }

  // helpers

  // private code

  private cellLeftClick(index: number) : void {
    if (!this.state.gameOver) {
      if (!this.state.running) {
        this.setState({ running: true });
        this.bombSetup(index);
        this.timerSetup(true);
      }

      if (!this.board[index].IsRedFlagVisible) {
        if (this.board[index].IsBomb) {
          // boom
          console.log('boom!');
          this.boom(index);
          this.stopGame();
          this.setState({ 
            running: false, 
            gameOver: true 
          });
        }
        else {
          this.board[index].IsRedFlagVisible = false;
          this.board[index].CssClass = "empty-cell";
          this.board[index].IsCleared = true;
          const coords = this.getCellCoord(this.board[index].CellNo);
          const nearBombCount = this.getNearBombCount(coords);
          if (nearBombCount > 0) {
            this.board[index].Text = nearBombCount.toString();
            this.board[index].CellStyle = this.getStyleColorByNbBomb(nearBombCount);
          }
          else {
            this.clearEmptyAround(coords);
          }
        }
      }
    }
  } // cellLeftClick
  
  cellRightClick(index: number): void {
    if (this.state.running && !this.state.gameOver && !this.board[index].IsCleared) {      
      this.board[index].IsRedFlagVisible = !this.board[index].IsRedFlagVisible;

      const nb = this.board.filter(x => x.IsRedFlagVisible).length;

      this.setState({ 
        flagCount: nb 
      });
    }
  }

  private timerSetup(onoff: boolean): void {
    if (onoff) {
      if (this.timerHandler === 0) {
        this.timerHandler = setInterval(() => { this.incrementElapsed() }, 1000);
      }
    }
    else {
      clearInterval(this.timerHandler);
    }
  }

  incrementElapsed(): void {
    if (this.state.elapsed < this.state.gameOption.MaxSec) {
      this.setState(prevState => {
        return { elapsed: prevState.elapsed + 1 };
      });
    }
    else {
      this.stopGame();
    }
  }

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

  // set bombs on board on first click
  bombSetup(firstClickedCellNo: number): void {
    this.setBombs(firstClickedCellNo);
    this.moveNearBombs(firstClickedCellNo);
  }

  getNearBombCount(coords: CellCoords): number {
    let nbBomb = 0;
    const surroundingBoardPos: number[] = this.computeSurroundingBoardPos(coords);
    surroundingBoardPos.forEach(n => {
      if (this.state.board[n].IsBomb) {
        nbBomb++;
      }
    });

    return nbBomb;
  }

  // clean around 'coords' up to cells with near bomb(s)
  private clearEmptyAround(coords: CellCoords): void {
    const pos = this.getBoardPos(coords);
    this.board[pos].IsCleared = true;
    this.board[pos].CssClass = "empty-cell";
    const nearBombCount = this.getNearBombCount(coords);
    if (nearBombCount > 0) {
      this.board[pos].Text = nearBombCount.toString();
      this.board[pos].CellStyle = this.getStyleColorByNbBomb(nearBombCount);
    }
    else {
      this.azimuth.forEach(aziStr => {
        const aziCoords: CellCoords = this.getAziCoords(coords, aziStr);
        if (aziCoords.valid) {
          const aziPos = this.getBoardPos(aziCoords);
          if (!this.board[aziPos].IsCleared && !this.board[aziPos].IsRedFlagVisible) {
            this.clearEmptyAround(aziCoords);
          }
        }
      });
    }
  }

  moveNearBombs(firstClickedCellNo: number) {
    const coords = this.getCellCoord(firstClickedCellNo);
    const surroundingBoardPos: number[] = this.computeSurroundingBoardPos(coords);

    this.azimuth.forEach(aziStr => {

      const aziCoords: CellCoords = this.getAziCoords(coords, aziStr);

      if (aziCoords.valid) {
        const curPos = this.getBoardPos(aziCoords);
        if (this.board[curPos].IsBomb) {
          this.board[curPos].IsBomb = false;

          let pos = this.getRandomPos();
          while (pos === firstClickedCellNo || surroundingBoardPos.indexOf(pos) !== -1 || this.board[pos].IsBomb) {
            pos = this.getRandomPos();
            console.log('moving bomb from %s %s to %s', aziStr, curPos, pos);
          }
          this.board[pos].IsBomb = true;
        }
      }

    });
  }

  getAziCoords(coords: CellCoords, aziStr: string): CellCoords {
    const newCoords = new CellCoords();

    switch (aziStr) {
      case 'ne':
        if (coords.RowPos > 1 && coords.ColPos > 1) {
          newCoords.RowPos = coords.RowPos - 1;
          newCoords.ColPos = coords.ColPos - 1;
          newCoords.valid = true;
        }
        break;

      case 'n':
        if (coords.RowPos > 1) {
          newCoords.RowPos = coords.RowPos - 1;
          newCoords.ColPos = coords.ColPos;
          newCoords.valid = true;
        }
        break;

      case 'nw':
        if (coords.RowPos > 1 && coords.ColPos < this.state.gameOption.NbCol) {
          newCoords.RowPos = coords.RowPos - 1;
          newCoords.ColPos = coords.ColPos + 1;
          newCoords.valid = true;
        }
        break;

      case 'w':
        if (coords.ColPos > 1) {
          newCoords.RowPos = coords.RowPos;
          newCoords.ColPos = coords.ColPos - 1;
          newCoords.valid = true;
        }
        break;

      case 'e':
        if (coords.ColPos < this.state.gameOption.NbCol) {
          newCoords.RowPos = coords.RowPos;
          newCoords.ColPos = coords.ColPos + 1;
          newCoords.valid = true;
        }
        break;

      case 'sw':
        if (coords.RowPos < this.state.gameOption.NbRow && coords.ColPos > 1) {
          newCoords.RowPos = coords.RowPos + 1;
          newCoords.ColPos = coords.ColPos - 1;
          newCoords.valid = true;
        }
        break;

      case 's':
        if (coords.RowPos < this.state.gameOption.NbRow) {
          newCoords.RowPos = coords.RowPos + 1;
          newCoords.ColPos = coords.ColPos;
          newCoords.valid = true;
        }
        break;

      case 'se':
        if (coords.RowPos < this.state.gameOption.NbRow && coords.ColPos < this.state.gameOption.NbCol) {
          newCoords.RowPos = coords.RowPos + 1;
          newCoords.ColPos = coords.ColPos + 1;
          newCoords.valid = true;
        }
        break;
    }

    return newCoords;
  }

  boom(currentCellNo: number): void {

    // voir a mover cette logique de nb dans l'aiguilleur de click
    let nb = this.board.filter(x => x.IsRedFlagVisible).length;

    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i].IsBomb) {
        if (i === currentCellNo) {
          this.board[i].CssClass = "cellBombCur";
        }
        else {
          if (!this.board[i].IsRedFlagVisible) {
            this.board[i].CssClass = "cellBomb";
          }
        }
      }
      else if (this.board[i].IsRedFlagVisible) {
        this.board[i].IsRedFlagVisible = false;
        this.board[i].CssClass = "badCellBomb";
        nb--;
      }
    }

    this.setState({
      flagCount: nb
    });
  }

  // get the board position by cell coord
  getBoardPos(coords: CellCoords): number {
    const rv = ((coords.RowPos - 1) * this.state.gameOption.NbCol) + (coords.ColPos - 1);

    return rv;
  }

  // get cell coord by board position
  getCellCoord(no: number): CellCoords {
    const cc = new CellCoords();

    cc.RowPos = Math.floor(no / this.state.gameOption.NbCol) + 1;
    cc.ColPos = (no % this.state.gameOption.NbCol) + 1;

    return cc;
  }

  // add the required bombs anywhere randomly on the board
  setBombs(firstClickedCellNo: number): void {
    if (this.state.gameOption.NbBomb < this.board.length) {
      for (let i = 0; i < this.state.gameOption.NbBomb; i++) {
        let pos = this.getRandomPos();
        while (pos === firstClickedCellNo || this.board[pos].IsBomb) {
          pos = this.getRandomPos();
        }
        this.board[pos].IsBomb = true;
      }
    }
  }

  computeSurroundingBoardPos(coords: CellCoords): number[] {
    const surroundingBoardPos: number[] = [];

    this.azimuth.forEach((aziStr) => {
      const aziCoords: CellCoords = this.getAziCoords(coords, aziStr);
      if (aziCoords.valid) {
        surroundingBoardPos.push(this.getBoardPos(aziCoords));
      }
    });

    return surroundingBoardPos;
  }

  // select text color by bomb count
  getStyleColorByNbBomb(nbBomb: number): object {
    let rv = {};

    switch (nbBomb) {
      case 1: rv = { color: 'blue' }; break;
      case 2: rv = { color: 'green' }; break;
      case 3: rv = { color: 'red' }; break;
      case 4: rv = { color: 'indigo' }; break;
      case 5: rv = { color: 'magenta' }; break;
      case 6: rv = { color: 'maroon' }; break;
      case 7: rv = { color: 'orangered' }; break;
      case 8: rv = { color: 'purple' }; break;
    }

    return rv;
  }

  // return a random where n >= 0 && n < board size
  private getRandomPos(): number {
    const rnd = Math.floor(Math.random() * this.state.board.length);

    return rnd;
  }

} // component
