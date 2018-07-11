import React, { Component } from 'react'
import MultiSig from '../utils/multisig'

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'

class Contributions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAcceptingContributions : true,  
      contributions: []
    }
  }

  componentWillMount() {
    MultiSig.contractStatus().then((contractStatus) => {
        if(contractStatus) {
            this.setState({
                isAcceptingContributions : false
            })
        }
    })
  }

  render() {
    return (
      <div >       
            <p>Contributions Accepted -  {this.state.isAcceptingContributions}</p>
      </div>
    );
  }
}

export default Contributions
