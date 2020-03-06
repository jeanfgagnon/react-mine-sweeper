import React from 'react';

import GameCell from './GameCell';

import GameOption from '../Common/GameOption';
import CellModel from '../Common/CellModel';

type Props = {
  gameOption: GameOption
};

export default class GameBoard extends React.Component<Props> {

  private board: CellModel[] = [];

  constructor(props: Props) {
    super(props);
    this.initBoard();
  }

  render() {
    return (
      <div id="game-board">
        <div className='game-grid'>
          <table>
            <tbody>
            {Array.from(Array(this.props.gameOption.NbRow)).map((tr, tr_i) => 
              <tr key={tr_i}>  
                {Array.from(Array(this.props.gameOption.NbCol)).map((a, td_i) => 
                    <td key={td_i}>
                      <GameCell cellModel={this.getCell(tr_i, td_i)}></GameCell>
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

  // event handlers

  // helpers
  
  // return cell base on coordinates
  private getCell(rowNo: number, colNo: number): CellModel {
    const index = (rowNo * this.props.gameOption.NbCol) + colNo;
    console.log('index %s', index);
    return this.board[index];
  }

  // private code

  // create board cells
  private initBoard(): void {
    this.board = [];
    let index = 0;
    for (let rowNo = 0; rowNo < this.props.gameOption.NbRow; rowNo++) {
      for (let colNo = 0; colNo < this.props.gameOption.NbCol; colNo++) {
        const cell = this.createCellModel(index, rowNo, colNo);
        this.board.push(cell);
        index++;
      }
    }
    console.log('board size %s', index);
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

  // properties
}