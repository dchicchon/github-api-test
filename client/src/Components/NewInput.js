import React, { Component } from 'react';

class NewInput extends Component {

    state = {
        user: ''
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div className='input-field col s6'>
                <input id='user' name='user' value={this.state.user} onChange={this.handleInputChange} type='text' className='user validate'></input>
                <label htmlFor='user'>User</label>
            </div>
        )
    }
}

export default NewInput