import React from 'react';

import GameOption from '../Common/GameOption';

import './GameConfig.css';

type Props = {
  gameOption: GameOption,
  OnChange: (newGO: GameOption) => void;
}

type State = {
  gameOption: GameOption
}

export default class GameConfig extends React.Component<Props, State> {

  // life cycle plumbing

  constructor(props: Props) {
    super(props);
    this.state = {
      gameOption: Object.assign({}, this.props.gameOption)
    }
  }

  render() {
    return (
      <div>

        <div className='gc-container'>
          <div className='gc-title'>
            Settings
        </div>

          <div className='gc-field'>
            <div className='gc-label-zone'>
              Rows
          </div>
            <div className='gc-input-zone'>
              <input type='number' id='txtRow'
                value={this.state.gameOption.NbRow}
                className='gc-input'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.inputChanged('row', e)} />
            </div>
          </div>

          <div className='gc-field'>
            <div className='gc-label-zone'>
              Columns
          </div>
            <div className='gc-input-zone'>
              <input type='number' id='txtCol'
                value={this.state.gameOption.NbCol}
                className='gc-input'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.inputChanged('col', e)} />
            </div>
          </div>

          <div className='gc-field'>
            <div className='gc-label-zone'>
              Bombs
          </div>
            <div className='gc-input-zone'>
              <input type='number' id='txtBomb'
                value={this.state.gameOption.NbBomb}
                className='gc-input'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.inputChanged('bomb', e)} />
            </div>
          </div>

        </div>

      </div>
    );
  } // render

  // event handlers

  inputChanged = (from: string, e: React.ChangeEvent<HTMLInputElement>): void => {
    const go: GameOption = Object.assign({}, this.state.gameOption);
    switch (from) {
      case 'row':
        go.NbRow = parseInt(e.target.value);
        break;

      case 'col':
        go.NbCol = parseInt(e.target.value);
        break;

      case 'bomb':
        go.NbBomb = parseInt(e.target.value);
        break;
    }

    this.setState({
      gameOption: go
    });
    
    this.props.OnChange(go);
  }

  // helpers

  // private code
}