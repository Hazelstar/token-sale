import { Button, Col, Divider, Input, Radio, Row, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { toBN } from 'web3-utils'
import {
  StyledHeading,
  StyledSubheading,
  StyledSubtext,
  StyledText,
  StyledValueText
} from '../components/typography'
import BreakLine from '../components/break-line'
import InformationCardsBox from '../components/information-cards-box'
import Table from '../components/table'
import ByAddressPane from '../components/tab-panes/by-address'
import ByWeb3Browser from '../components/tab-panes/by-web3-browser'
import ByInputData from '../components/tab-panes/by-input-data'
import SecondsInSubsale from '../components/seconds-in-subsale'
import PricePerPNK from '../components/price-per-pnk'
import SellOrdersGraph from '../components/sell-orders-graph'
import { useDrizzle, useDrizzleState } from '../temp/drizzle-react-hooks'
import { ethToWei, truncateDecimalString, weiToEth } from '../utils/numbers'
import { ReactComponent as RightArrow } from '../assets/images/arrow-right-solid.svg'
import { ReactComponent as Clock } from '../assets/images/clock-regular.svg'
import { ReactComponent as Accepted } from '../assets/images/check-solid.svg'
import { ReactComponent as Rejected } from '../assets/images/times-solid.svg'
import HeaderImg from '../assets/images/header.png'

const StyledCardContainer = styled.div`
  margin-top: 25px;

  .ant-tabs-card {
    .ant-tabs-content {
      background: rgba(255, 255, 255, 0.08);
      height: 515px;

      .ant-tabs-tabpane {
        padding: 16px;
      }
    }
    .ant-tabs-bar {
      border: none;
      height: 35px;
      margin: 0;

      .ant-tabs-tab-next {
        display: none;
      }

      .ant-tabs-nav-container {
        margin-bottom: 0px;
      }

      .ant-tabs-nav {
        height: 35px;
        width: 100%;

        .ant-tabs-tab {
          border-bottom: 1px solid #009aff;
          border-left: none;
          border-right: none;
          border-top: none;
          height: 34px;
          margin-right: 0px;
          text-align: center;
          width: 50%;
        }

        .ant-tabs-tab-active {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid #009aff;
          border-bottom: none;
          height: 35px;
        }
      }
    }
  }
`

const StyledTabText = styled(StyledText)`
  font-size: 14px;
  font-weight: 500;
`

const StyledSearch = styled(Input.Search)`
  .ant-input {
    background-color: rgba(255, 255, 255, 0.08) !important;
    border: none !important;
    border-radius: 3px;
    color: white !important;
    height: 40px;
  }

  .ant-btn {
    background: #009aff;
    border-radius: 3px;
    color: white;
    height: 40px;
    padding-top: 0px;
  }

  .ant-input-search.ant-input-search-enter-button {
    border: none;
  }
`

const StyledAccepted = styled(Accepted)`
  color: #009aff;
  height: 20px;
`

const StyledRejected = styled(Rejected)`
  color: red;
  height: 20px;
`

const StyledPending = styled(Clock)`
  color: white;
  height: 20px;
`

export default () => {
  const { useCacheCall, drizzle } = useDrizzle()
  const drizzleState = useDrizzleState(drizzleState => ({
    loaded: drizzleState.drizzleStatus.initialized,
    account: drizzleState.accounts[0]
  }))

  if (!drizzleState.loaded) return (
    <div>loading...</div>
  )

  const [account, setAccount] = useState(drizzleState.account)

  // Set account when drizzle state loads
  useEffect(() => {
    setAccount(drizzleState.account)
  }, [drizzleState.account])

  let tokensForSale
  let numberOfSubsales
  let currentSubsaleNumber
  let valuationAndCutOff
  let startTime
  let secondsPerSubsale
  let bidIDs = []
  // if (drizzleState.loaded) {
  //   tokensForSale = useCacheCall('ContinuousICO', 'tokensForSale')
  //   numberOfSubsales = useCacheCall('ContinuousICO', 'numberOfSubsales')
  //   currentSubsaleNumber = useCacheCall(
  //     'ContinuousICO',
  //     'getOngoingSubsaleNumber'
  //   )
  //   valuationAndCutOff =
  //     currentSubsaleNumber &&
  //     useCacheCall('ContinuousICO', 'valuationAndCutOff', currentSubsaleNumber)
  //   startTime = useCacheCall('ContinuousICO', 'startTime')
  //   secondsPerSubsale = useCacheCall('ContinuousICO', 'secondsPerSubsale')
  //   bidIDs =
  //     (account &&
  //       useCacheCall(
  //         'ContinuousICO',
  //         'getBidIDsForContributor',
  //         account,
  //         'false'
  //       )) ||
  //     []
  // }

  const amountForSaleToday =
    numberOfSubsales &&
    tokensForSale &&
    toBN(tokensForSale).div(toBN(numberOfSubsales))

  // Fetch all data for users bids
  const bids = {}
  // const bids = useCacheCall(['ContinuousICO'], call =>
  //   bidIDs.length
  //     ? bidIDs.reduce(
  //         (acc, bidID) => {
  //           if (!acc.IDs[bidID]) {
  //             acc.IDs[bidID] = true
  //             const bid = call('ContinuousICO', 'bids', bidID)
  //             if (bid) {
  //               acc.bids.push({ ...bid, bidID })
  //               if (!acc.subsaleIDs[bid.subsaleNumber]) {
  //                 acc.subsaleIDs[bid.subsaleNumber] = true
  //                 const valAndCutOffForSubsale = call(
  //                   'ContinuousICO',
  //                   'valuationAndCutOff',
  //                   bid.subsaleNumber
  //                 )
  //
  //                 if (valAndCutOffForSubsale)
  //                   acc.valAndCutOffForSubsale[
  //                     bid.subsaleNumber.toString()
  //                   ] = valAndCutOffForSubsale
  //                 else acc.loadingValAndCutOffs = true
  //               }
  //             } else acc.loading = true
  //           }
  //           return acc
  //         },
  //         {
  //           loading: false,
  //           loadingValAndCutOffs: false,
  //           bids: [],
  //           valAndCutOffForSubsale: {},
  //           IDs: {},
  //           subsaleIDs: {}
  //         }
  //       )
  //     : {
  //         loading: true,
  //         loadingValAndCutOffs: true,
  //         bids: [],
  //         valAndCutOffForSubsale: {},
  //         IDs: {},
  //         subsaleIDs: {}
  //       }
  // )

  // Parse bids to the table columns
  const columnData = []
  if (
    !bids.loading &&
    !bids.loadingValAndCutOffs &&
    amountForSaleToday &&
    startTime &&
    secondsPerSubsale
  )
    for (let i = 0; i < bids.bids.length; i++) {
      const _bid = bids.bids[i]
      const bidColData = {
        amount: null,
        price: null,
        date: null,
        status: null
      }

      const valAndCutOff = bids.valAndCutOffForSubsale[_bid.subsaleNumber]
      // currentCutOffBidMaxValuation will come back as 0 if all bids are accepted
      const currentCutOffBidMaxValuation =
        valAndCutOff.currentCutOffBidMaxValuation

      let contrib = 0
      if (toBN(_bid.maxValuation).gt(toBN(currentCutOffBidMaxValuation)))
        contrib = _bid.contrib
      else if (toBN(_bid.maxValuation).eq(toBN(currentCutOffBidMaxValuation)))
        if (_bid.bidID === valAndCutOff.currentCutOffBidID)
          contrib = valAndCutOff.currentCutOffBidContrib
        else if (_bid.bidID > valAndCutOff.currentCutOffBidID)
          contrib = _bid.contrib

      if (contrib > 0)
        if (currentSubsaleNumber === _bid.subsaleNumber)
          bidColData.status = <StyledPending />
        else bidColData.status = <StyledAccepted />
      else bidColData.status = <StyledRejected />

      bidColData.amount = truncateDecimalString(
        weiToEth(
          amountForSaleToday
            .mul(toBN(contrib.toString()))
            .div(toBN(valAndCutOff.valuation.toString()))
            .toString()
        ),
        0
      )

      bidColData.price = weiToEth(bids.bids[i].contrib.toString())

      // calcuate start date
      const _startTime = toBN(startTime)
      const _subsaleNumberMultiplyer = toBN(_bid.subsaleNumber - 1)
      const _secondsPerSubsale = toBN(secondsPerSubsale)
      bidColData.date = _startTime
        .add(_subsaleNumberMultiplyer.mul(_secondsPerSubsale))
        .toNumber()

      columnData[i] = bidColData
    }

  return (
    <div>
      <Row>
        <img src={HeaderImg} />
        <StyledHeading>Kleros PNK Sale</StyledHeading>
      </Row>
      <Row style={{ marginBottom: '76px' }}>
        <Col lg={9}>
          <StyledSubheading>How to Contribute</StyledSubheading>
          <StyledCardContainer>
            <Tabs type="card">
              <Tabs.TabPane key={1} tab={<StyledTabText>Basic</StyledTabText>}>
                <ByAddressPane
                  contributionAddress={
                    drizzle.contracts['ERC20Seller']
                      ? drizzle.contracts['ERC20Seller'].address
                      : 'loading...'
                  }
                />
              </Tabs.TabPane>
              <Tabs.TabPane key={2} tab={<StyledTabText>Web3</StyledTabText>}>
                <ByWeb3Browser />
              </Tabs.TabPane>
            </Tabs>
          </StyledCardContainer>
        </Col>
        <Col lg={13} offset={1}>
          <BreakLine style={{marginTop: '95px'}}/>
          <StyledText style={{ marginBottom: '18px', marginTop: '18px' }}>
            A total of 160 Million of Pinakion (PNK) will be sold over the course of the next (two) week(s).
          </StyledText>
          <InformationCardsBox
            subtextMain="Amount for Sale"
            noMiddleLine={true}
            textMain={
              '160,000,000 PNK'
            }
            textSecondary={
              ''
            }
          />
          <InformationCardsBox
            subtextMain="TOTAL PNK sold"
            subtextSecondary="Remaining amount for sale"
            textMain={'120,000,000 PNK'}
            textSecondary={'40,000,000 PNK'}
          />
        </Col>
      </Row>
      <BreakLine />
      <Row style={{ margin: '45px 0px' }}>
        <Col lg={9}>
          <StyledSubheading>Sell Orders</StyledSubheading>
        </Col>
      </Row>
      <SellOrdersGraph/>
      
      <Row>
        <Col lg={24}>
          <Table columnData={columnData.reverse()} />
        </Col>
      </Row>
    </div>
  )
}
