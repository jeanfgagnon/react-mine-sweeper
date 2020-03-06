import React from 'react';

import GameCell from './GameCell';
import GameOption from '../Common/GameOption';

type Props = {
  gameOption: GameOption
};

export default class GameBoard extends React.Component<Props> {

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
                      <GameCell></GameCell>
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
}