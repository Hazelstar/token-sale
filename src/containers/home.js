import { Button, Col, Divider, Radio, Row, Tabs, Card } from 'antd'
import React from 'react'
import styled from 'styled-components/macro'

import {
  StyledHeading,
  StyledSubheading,
  StyledText,
  StyledSubtext,
  StyledValueText
} from '../components/typography'
import BreakLine from '../components/break-line'
import { useDrizzle, useDrizzleState } from '../temp/drizzle-react-hooks'

const StyledCardContainer = styled.div`
  margin-top: 25px;

  .ant-tabs-card {
    .ant-tabs-content {
      height: 120px;

      .ant-tabs-tabpane {
        padding: 16px;
        background: rgba(255, 255, 255, 0.08);
      }
    }
    .ant-tabs-bar {
      border: none;
      margin: 0;
      height: 35px;

      .ant-tabs-tab-next {
        display: none;
      }

      .ant-tabs-nav-container {
        margin-bottom: 0px;
      }

      .ant-tabs-nav {
        width: 100%;
        height: 35px;

        .ant-tabs-tab {
          border-bottom: 1px solid #009aff;
          border-left: none;
          border-right: none;
          border-top: none;
          margin-right: 0px;
          text-align: center;
          width: 33.3%;
          height: 34px;
        }

        .ant-tabs-tab-active {
          border: 1px solid #009aff;
          border-bottom: none;
          background: rgba(255, 255, 255, 0.08);
          height: 35px;
        }
      }
    }
  }
`

const StyledTabText = styled(StyledText)`
  font-weight: 500;
  font-size: 0.95vw;
`

const StyledCard = styled(Card)`
  background: rgba(255, 255, 255, 0.08);
  border: none;
  padding: 16px;

  .ant-card-body {
    padding: 0px;
    border-right: 1px solid white;
  }
`

export default () => {
  const { useCacheCall, useCacheEvents } = useDrizzle()
  const drizzleState = useDrizzleState(drizzleState => ({
    account: drizzleState.accounts[0]
  }))

  return (
    <div>
      <Row>
        <Col span={9}>
          <StyledSubheading>Contribution Options</StyledSubheading>
          <StyledCardContainer>
            <Tabs type="card">
              <Tabs.TabPane
                tab={<StyledTabText>by Address</StyledTabText>}
                key={1}
              >
                Address stuff goes here
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={<StyledTabText>by Web3 Wallet</StyledTabText>}
                key={2}
              >
                Web3 Wallet
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={<StyledTabText>by Inputing Data</StyledTabText>}
                key={3}
              >
                inputing data
              </Tabs.TabPane>
            </Tabs>
          </StyledCardContainer>
        </Col>
        <Col span={13} offset={1}>
          <StyledHeading>
            Kleros Pinakion (PNK) Token Distribution
          </StyledHeading>
          <StyledText style={{ 'margin-bottom': '18px' }}>
            Kleros Continuous Sale: 12% of the token supply is to be sold over a
            12-month period in daily auction
          </StyledText>
          <BreakLine />
          <StyledSubheading style={{ 'margin-top': '34px' }}>
            Daily Auction
          </StyledSubheading>
          <StyledCard>XXXX PNK</StyledCard>
        </Col>
      </Row>
    </div>
  )
}