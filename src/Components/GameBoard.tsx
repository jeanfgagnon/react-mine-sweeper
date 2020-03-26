import React, { MouseEvent } from 'react';

import GameCell from './GameCell';

import GameOption from '../Common/GameOption';
import CellModel from '../Common/CellModel';
import CellCoords from '../Common/CellCoords';

import './GameBoard.css';

type Props = {
  gameOption: GameOption,
  OnFirstClick: () => void,
  SetFlagCount: (nb: number) => void;
  OnBoom: () => void,
  restart: boolean,
  gameOver: boolean,
  board: CellModel[]
};

type State = {
  board: CellModel[],
  running: boolean
};

export default class GameBoard extends React.Component<Props, State> {

  private board: CellModel[] = [];
  private azimuth = ['ne', 'n', 'nw', 'w', 'e', 'sw', 's', 'se'];

  // life cycle plumbing

  constructor(props: Props) {
    super(props);
    this.state = { board: this.board, running: false };
  }

  render() {
    return (
      <div id="game-board">
        <div className='game-grid'>
          <table onContextMenu={(e: MouseEvent<HTMLElement>): void => { e.preventDefault(); }}>
            <tbody>
              {Array.from(Array(this.props.gameOption.NbRow)).map((tr, tr_i) =>
                <tr key={tr_i}>
                  {Array.from(Array(this.props.gameOption.NbCol)).map((a, td_i) =>
                    <td key={td_i}>
                      <GameCell
                        key={`${tr_i}_${td_i}`}
                        OnRightClick={this.onCellRightClicked}
                        OnClick={this.onCellClicked}
                        cellModel={this.getCell(tr_i, td_i)}></GameCell>
                    </td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    if (this.props.restart) {
      //this.initBoard();
      if (this.state.running) {
        this.setState({ running: false });
      }
    }
  }

  // event handlers

  onCellClicked = (e: Event, index: number) => {
    if (!this.props.gameOver) {
      if (!this.state.running) {
        this.setState({ running: true });
        this.props.OnFirstClick();
        this.bombSetup(index);
      }

      if (!this.props.board[index].IsRedFlagVisible) {
        if (this.props.board[index].IsBomb) {
          // boom
          console.log('boom!');
          this.boom(index);
          this.setState({ running: false });
        }
        else {
          this.props.board[index].IsRedFlagVisible = false;
          this.props.board[index].CssClass = "empty-cell";
          this.props.board[index].IsCleared = true;
          const coords = this.getCellCoord(this.props.board[index].CellNo);
          const nearBombCount = this.getNearBombCount(coords);
          if (nearBombCount > 0) {
            this.props.board[index].Text = nearBombCount.toString();
            this.props.board[index].CellStyle = this.getStyleColorByNbBomb(nearBombCount);
          }
          else {
            this.clearEmptyAround(coords);
          }
          this.setState({ board: this.props.board });
        }
      }
    }
  }

  onCellRightClicked = (e: Event, index: number) => {
    const cellModel = this.props.board[index];
    if (this.state.running && !this.props.gameOver && !cellModel.IsCleared) {
      cellModel.IsRedFlagVisible = !cellModel.IsRedFlagVisible;
      this.props.board[index] = JSON.parse(JSON.stringify(cellModel));
      this.setState({ board: this.props.board });
      const nb = this.props.board.filter(x => x.IsRedFlagVisible).length;
      this.props.SetFlagCount(nb);
    }
  }

  // helpers

  // return cell based on coordinates
  private getCell(rowNo: number, colNo: number): CellModel {
    const index = (rowNo * this.props.gameOption.NbCol) + colNo;
    return this.props.board[index];
  }

  // private code

  // set bombs on board on first click
  bombSetup(firstClickedCellNo: number): void {
    this.setBombs(firstClickedCellNo);
    this.moveNearBombs(firstClickedCellNo);
  }

  getNearBombCount(coords: CellCoords): number {
    let nbBomb = 0;
    const surroundingBoardPos: number[] = this.computeSurroundingBoardPos(coords);
    surroundingBoardPos.forEach(n => {
      if (this.props.board[n].IsBomb) {
        nbBomb++;
      }
    });

    return nbBomb;
  }

  // clean around 'coords' up to cells with near bomb(s)
  private clearEmptyAround(coords: CellCoords): void {
    const pos = this.getBoardPos(coords);
    this.props.board[pos].IsCleared = true;
    this.props.board[pos].CssClass = "empty-cell";
    const nearBombCount = this.getNearBombCount(coords);
    if (nearBombCount > 0) {
      this.props.board[pos].Text = nearBombCount.toString();
      this.props.board[pos].CellStyle = this.getStyleColorByNbBomb(nearBombCount);
    }
    else {
      this.azimuth.forEach(aziStr => {
        const aziCoords: CellCoords = this.getAziCoords(coords, aziStr);
        if (aziCoords.valid) {
          const aziPos = this.getBoardPos(aziCoords);
          if (!this.props.board[aziPos].IsCleared && !this.props.board[aziPos].IsRedFlagVisible) {
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
        if (this.props.board[curPos].IsBomb) {
          this.props.board[curPos].IsBomb = false;

          let pos = this.getRandomPos();
          while (pos === firstClickedCellNo || surroundingBoardPos.indexOf(pos) !== -1 || this.props.board[pos].IsBomb) {
            pos = this.getRandomPos();
            console.log('moving bomb from %s %s to %s', aziStr, curPos, pos);
          }
          this.props.board[pos].IsBomb = true;
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
        if (coords.RowPos > 1 && coords.ColPos < this.props.gameOption.NbCol) {
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
        if (coords.ColPos < this.props.gameOption.NbCol) {
          newCoords.RowPos = coords.RowPos;
          newCoords.ColPos = coords.ColPos + 1;
          newCoords.valid = true;
        }
        break;

      case 'sw':
        if (coords.RowPos < this.props.gameOption.NbRow && coords.ColPos > 1) {
          newCoords.RowPos = coords.RowPos + 1;
          newCoords.ColPos = coords.ColPos - 1;
          newCoords.valid = true;
        }
        break;

      case 's':
        if (coords.RowPos < this.props.gameOption.NbRow) {
          newCoords.RowPos = coords.RowPos + 1;
          newCoords.ColPos = coords.ColPos;
          newCoords.valid = true;
        }
        break;

      case 'se':
        if (coords.RowPos < this.props.gameOption.NbRow && coords.ColPos < this.props.gameOption.NbCol) {
          newCoords.RowPos = coords.RowPos + 1;
          newCoords.ColPos = coords.ColPos + 1;
          newCoords.valid = true;
        }
        break;
    }

    return newCoords;
  }

  boom(currentCellNo: number): void {
    let nb = this.props.board.filter(x => x.IsRedFlagVisible).length;

    for (let i = 0; i < this.props.board.length; i++) {
      if (this.props.board[i].IsBomb) {
        if (i === currentCellNo) {
          this.props.board[i].CssClass = "cellBombCur";
        }
        else {
          if (!this.props.board[i].IsRedFlagVisible) {
            this.props.board[i].CssClass = "cellBomb";
          }
        }
      }
      else if (this.props.board[i].IsRedFlagVisible) {
        this.props.board[i].IsRedFlagVisible = false;
        this.props.board[i].CssClass = "badCellBomb";
        nb--;
      }
    }

    this.props.SetFlagCount(nb);
    this.props.OnBoom();
  }

  // get the board position by cell coord
  getBoardPos(coords: CellCoords): number {
    const rv = ((coords.RowPos - 1) * this.props.gameOption.NbCol) + (coords.ColPos - 1);

    return rv;
  }

  // get cell coord by board position
  getCellCoord(no: number): CellCoords {
    const cc = new CellCoords();

    cc.RowPos = Math.floor(no / this.props.gameOption.NbCol) + 1;
    cc.ColPos = (no % this.props.gameOption.NbCol) + 1;

    return cc;
  }

  // add the required bombs anywhere randomly on the board
  setBombs(firstClickedCellNo: number): void {
    if (this.props.gameOption.NbBomb < this.props.board.length) {
      for (let i = 0; i < this.props.gameOption.NbBomb; i++) {
        let pos = this.getRandomPos();
        while (pos === firstClickedCellNo || this.props.board[pos].IsBomb) {
          pos = this.getRandomPos();
        }
        this.props.board[pos].IsBomb = true;
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
    const rnd = Math.floor(Math.random() * this.props.board.length);

    return rnd;
  }

  // properties

}