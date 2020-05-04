import React from 'react';
import Cell from './Cell';
import Help from './Help';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            boardData: this.initBoard(this.props.height, this.props.width, this.props.mines),
            gameStatus: "Game in progress",
            mineCount: this.props.mines
        }

        this.toggleHelpPopup = this.toggleHelpPopup.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.handleContextMenuClick = this.handleContextMenuClick.bind(this);
    }

    // Get initial Board
    initBoard(height, width, mines) {
        let data = this.createEmptyArray(height, width);
        data = this.plantMines(data, height, width, mines);
        data = this.getNeighbours(data, height, width);

        return data;
    }

    createEmptyArray(height, width) {
        let data = [];

        for (let i = 0; i < height; i++) {
            data.push([]);

            for (let j = 0; j < width; j++) {

                // set the state of each element
                data[i][j] = {
                    x: i,
                    y: j,
                    isMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false
                };
            }
        }

        return data;
    }

    plantMines(data, height, width, mines) {
        let x, y, minesPlanted = 0;

        while (minesPlanted < mines) {
            x = this.getRandomNumber(width);
            y = this.getRandomNumber(height);

            if (!data[x][y].isMine) {
                data[x][y].isMine = true;
                minesPlanted++;
            }
        }

        return data;
    }

    // gets a random number given a vlaue
    getRandomNumber(value) {
        return Math.floor(Math.random() * 1000 + 1) % value;
    }

    // gets the number of neighbouring mines for each cell
    getNeighbours(data, height, width) {
        let updatedData = data;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (data[i][j].isMine !== true) {
                    let mine = 0;
                    const area = this.traverseBoard(data[i][j].x, data[i][j].y, data);

                    area.map(value => {
                        if (value.isMine) {
                            mine++;
                        }
                    });

                    if (mine === 0) {
                        updatedData[i][j].isEmpty = true;
                    }

                    updatedData[i][j].neighbour = mine;
                }
            }
        }

        return updatedData;
    }

    // looks for neighbouring cells and returns them
    traverseBoard(x, y, data) {
        const element = [];

        // above
        if (x > 0) {
            element.push(data[x - 1][y]);
        }

        // below
        if (x < this.props.height - 1) {
            element.push(data[x + 1][y]);
        }

        // left
        if (y > 0) {
            element.push(data[x][y - 1]);
        }

        // right
        if (y < this.props.width - 1) {
            element.push(data[x][y + 1]);
        }

        // top left
        if (x > 0 && y > 0) {
            element.push(data[x - 1][y - 1]);
        }

        // top right
        if (x > 0 && y < this.props.width - 1) {
            element.push(data[x - 1][y + 1]);
        }

        // bottom right
        if (x < this.props.height - 1 && y < this.props.width - 1) {
            element.push(data[x + 1][y + 1]);
        }

        // bottom left
        if (x < this.props.height - 1 && y > 0) {
            element.push(data[x + 1][y - 1]);
        }

        return element;
    }

    // reveals the whole board
    revealBoard() {
        let updatedData = this.state.boardData;

        updatedData.map(row => {
            row.map(item => {
                item.isRevealed = true;
            });
        });

        this.setState({
            boardData: updatedData
        });
    }

    handleCellClick(x, y) {
        // check if revealed, return if true.
        if (
            this.state.boardData[x][y].isRevealed ||
            this.state.boardData[x][y].isFlagged
        )
            return null;

        // check if mine, game over if true
        if (this.state.boardData[x][y].isMine) {
            this.setState({ gameStatus: "You Lost" });
            this.revealBoard();
            alert("Game Over");
        }

        let updatedData = this.state.boardData;
        updatedData[x][y].isFlagged = false;
        updatedData[x][y].isRevealed = true;

        if (updatedData[x][y].isEmpty) {
            updatedData = this.revealEmpty(x, y, updatedData);
        }

        if (this.getHidden(updatedData).length === this.props.mines) {
            this.setState({ mineCount: 0, gameStatus: "You Win" });
            this.revealBoard();
            alert("You Win");
        }

        this.setState({
            boardData: updatedData,
            mineCount: this.props.mines - this.getFlags(updatedData).length
        });
    }

    /* reveal logic for empty cell */
    revealEmpty(x, y, data) {
        let area = this.traverseBoard(x, y, data);
        area.map(value => {
            if (!value.isFlagged && !value.isRevealed && (value.isEmpty || !value.isMine)) {
                data[value.x][value.y].isRevealed = true;
                if (value.isEmpty) {
                    this.revealEmpty(value.x, value.y, data);
                }
            }
        });
        return data;

    }

    //Helper functions

    // get mines
    getMines(data) {
        let mineArray = [];

        data.map(row => {
            row.map(item => {
                if (item.isMine) {
                    mineArray.push(item);
                }
            });
        });

        return mineArray;
    }

    // get Flags
    getFlags(data) {
        let flagArray = [];

        data.map(row => {
            row.map(item => {
                if (item.isFlagged) {
                    flagArray.push(item);
                }
            });
        });

        return flagArray;
    }

    // get Hidden cells
    getHidden(data) {
        let hiddenArray = [];

        data.map(row => {
            row.map(item => {
                if (!item.isRevealed) {
                    hiddenArray.push(item);
                }
            });
        });

        return hiddenArray;
    }


    handleContextMenuClick(e, x, y) {

        e.preventDefault();
        let updatedData = this.state.boardData;
        let mines = this.state.mineCount;

        // check if already revealed
        if (updatedData[x][y].isRevealed) return;

        if (updatedData[x][y].isFlagged) {
            updatedData[x][y].isFlagged = false;
            if (updatedData[x][y].isMine) {
                mines++;
            }
        } else {
            updatedData[x][y].isFlagged = true;
            if (updatedData[x][y].isMine) {
                mines--;
            }
        }

        if (mines === 0) {
            const mineArray = this.getMines(updatedData);
            const flagArray = this.getFlags(updatedData);

            if (JSON.stringify(mineArray) === JSON.stringify(flagArray)) {
                this.setState({ mineCount: 0, gameStatus: "You Win." });
                this.revealBoard();
                alert("You Win");
            }
        }

        this.setState({
            boardData: updatedData,
            mineCount: mines
        });
    }

    renderBoard(data) {
        return data.map(row => {
            return row.map(item => {
                return (
                    <div key={item.x * row.length + item.y}>
                        <Cell
                            onClick={() => this.handleCellClick(item.x, item.y)}
                            contextMenu={(e) => this.handleContextMenuClick(e, item.x, item.y)}
                            value={item}
                        />
                        {(row[row.length - 1] === item) ? <div className="clear" /> : ""}
                    </div>
                )
            });
        });
    }

    resetBoard() {
        window.location.reload(false);
    }

    toggleHelpPopup() {
        console.log(this.state.showPopup);

        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    render() {
        return (
            <div className="container">
                <div className="board">
                    <div className="game-info">
                        <span className="info">
                            Mines remaining: {this.state.mineCount}
                        </span>
                        <h1 className="info">{this.state.gameStatus}</h1>
                        <span >
                            <button className="btnReset" onClick={this.resetBoard}>
                                Reset
                        </button>
                            <button className="btnHelp" onClick={this.toggleHelpPopup}>
                                Help
                        </button>
                            {this.state.showPopup ?
                                <Help
                                    text='Click "Close Button" to hide popup'
                                    closePopup={this.toggleHelpPopup}
                                />
                                : null
                            }
                        </span>
                    </div>
                    {this.renderBoard(this.state.boardData)}
                </div>
            </div>
        )
    }
}

export default Board;