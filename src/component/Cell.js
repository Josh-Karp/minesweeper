import React from 'react';

class Cell extends React.Component {

    getValue() {
        const { value } = this.props;

        if (!value.isRevealed) {
            return this.props.value.isFlagged ? "🚩" : null;
        }

        if (value.isMine) {
            return "💣";
        }

        if (value.neighbour === 0) {
            return null;
        }

        return value.neighbour;
    }

    render() {
        const { value, onClick, contextMenu } = this.props;
        let className =
            "cell" +
            (value.isRevealed ? "" : " hidden") +
            (value.isMine ? " is-mine" : "") +
            (value.isFlagged ? " is-flag" : "");

        return (
            <div
                onClick={onClick}
                className={className}
                onContextMenu={contextMenu}
            >
                {this.getValue()}
            </div>
        )
    }
}

export default Cell;