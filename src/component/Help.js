import React from 'react';
import '../styles/stylePopUp.css';

class Help extends React.Component {
    render() {
        return (
            <div className='popup'>
                <div className='popupInner'>
                    <h1>How to play:</h1>
                    <p>You are presented with a board of squares.</p>
                    <p>Some squares contain mines (bombs), others don't. If you click on a square containing a bomb, you lose. If you manage to click all the squares (without clicking on any bombs) you win.</p>
                    <p>Clicking a square which doesn't have a bomb reveals the number of neighbouring squares containing bombs. Use this information plus some guess work to avoid the bombs.</p>
                    <p>To open a square, point at the square and click on it. To mark a square you think is a bomb, point and right-click to place a flag.</p>
                    <button onClick={this.props.closePopup}>Close</button>
                </div>
            </div>
        );
    }
}

export default Help;