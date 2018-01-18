import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'

import UDapp from '../UDapp'

import H2 from '../../components/H2'
import UserInfo from '../../components/UserInfo'

import Event from '../../components/Event'
import FlexContainer from '../../components/FlexContainer'
import Section from '../../components/Section'

import {
  setupEthereum,
} from '../../actions'

import {
  selectParameters,
  selectWallet,
  selectCandidates,
  selectFaceoffs,
  selectWhitelist,
  selectError,
  selectAccount,
  selectAllListings,
} from '../../selectors'

const ApplyWrapper = styled.div`
  padding: 1em;
`

class Apply extends Component {
  constructor() {
    super()
    this.state = {
      listing: '',
    }
  }

  componentDidMount() {
    console.log('Apply props:', this.props)
    this.props.onSetupEthereum('ganache')
  }

  selectNetwork(network) {
    this.props.onSetupEthereum(network)
  }

  render() {
    const {
      wallet,
      account,
      candidates,
      faceoffs,
      // listings,
      whitelist,
      // parameters,
      match,
      error,
    } = this.props

    return (
      <ApplyWrapper>
        <UDapp
          ethBalance={wallet.get('ethBalance')}
          tokenBalance={wallet.getIn(['token', 'tokenBalance'])}
          tokensAllowed={wallet.getIn(['token', 'allowances', 'registry', 'total'])}
          error={error}
          route={match.path}
        />

        <UserInfo
          network={wallet.get('network')}
          account={account}
          error={error}
          ethBalance={wallet.get('ethBalance')}
          tokenBalance={wallet.getIn(['token', 'tokenBalance'])}
          tokensAllowed={wallet.getIn(['token', 'allowances', 'registry', 'total'])}
          onSelectNetwork={this.selectNetwork}
        />

        <H2>{'Applicants ('}{candidates.size}{')'}</H2>
        <FlexContainer>
          {candidates.size > 0 &&
            candidates.map(log => (
              <Section key={log.get('listing')}>
                <Event
                  latest={log.get('latest')}
                  owner={log.get('owner')}
                  listing={log.get('listing')}
                  whitelisted={log.getIn(['latest', 'whitelisted'])}
                />
              </Section>
            ))}
        </FlexContainer>
      </ApplyWrapper>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSetupEthereum: (network) => dispatch(setupEthereum(network)),
  }
}

const mapStateToProps = createStructuredSelector({
  parameters: selectParameters,
  wallet: selectWallet,
  account: selectAccount,
  candidates: selectCandidates,
  listings: selectAllListings,
  error: selectError,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Apply)
