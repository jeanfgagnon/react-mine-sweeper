import React, { MouseEvent } from 'react';

import GameCell from './GameCell';

import GameOption from '../Common/GameOption';
import CellModel from '../Common/CellModel';

import './GameBoard.css';

type Props = {
  gameOption: GameOption,
  board: CellModel[],
  OnClick: (cellNo: number, isRightClick: boolean) => void
};

export default class GameBoard extends React.Component<Props> {

  // life cycle plumbing

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

  // event handlers

  onCellClicked = (index: number, isRightClick: boolean) => {
    this.props.OnClick(index, isRightClick);
    // move le reste dans form
  }

  // helpers

  // return cell based on coordinates
  private getCell(rowNo: number, colNo: number): CellModel {
    const index = (rowNo * this.props.gameOption.NbCol) + colNo;
    return this.props.board[index];
  }

  // private code


  // properties

}